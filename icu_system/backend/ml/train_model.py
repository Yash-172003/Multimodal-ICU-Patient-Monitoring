import os
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from sqlalchemy.orm import Session
from ..database.db import SessionLocal
from ..models import Patient, Vitals
from .models import CombinedModel, ClinicalBERTEncoder
from .preprocess import vitals_sequence, latest_note_text

MODEL_PATH = "backend/ml/checkpoints/model.pt"

class ICUTrainDataset(Dataset):
    def __init__(self, db: Session, patient_ids, seq_len: int = 96):
        self.db = db
        self.ids = patient_ids
        self.seq_len = seq_len
        self.text = ClinicalBERTEncoder()

    def __len__(self):
        return len(self.ids)

    def pad_or_truncate(self, x: torch.Tensor) -> torch.Tensor:
        # x: (T, 6) -> (L, 6)
        T = x.shape[0]
        L = self.seq_len
        if T == L:
            return x
        if T > L:
            return x[-L:]
        # pad at start with zeros
        pad = torch.zeros((L - T, x.shape[1]), dtype=x.dtype)
        return torch.cat([pad, x], dim=0)

    def label_from_vitals(self, x: torch.Tensor) -> float:
        # simple heuristic label using last timestep
        last = x[-1]
        hr, sbp, dbp, spo2, rr, temp = last.tolist()
        risk = 0
        risk += 1 if hr > 110 or hr < 50 else 0
        risk += 1 if sbp < 90 else 0
        risk += 1 if spo2 < 92 else 0
        risk += 1 if rr > 24 or rr < 10 else 0
        risk += 1 if temp > 38.2 or temp < 36.0 else 0
        return 1.0 if risk >= 2 else 0.0

    def __getitem__(self, idx):
        pid = self.ids[idx]
        x = vitals_sequence(self.db, pid, hours=24).squeeze(0)  # (T,6)
        x = self.pad_or_truncate(x)
        note = latest_note_text(self.db, pid)
        if note == "":
            note = "no clinical note"
        te = self.text.encode([note]).squeeze(0)
        y = torch.tensor(self.label_from_vitals(x), dtype=torch.float32)
        return x, te, y

class Collate:
    def __call__(self, batch):
        xs, tes, ys = zip(*batch)
        x = torch.stack(xs, dim=0)  # (B,L,6)
        te = torch.stack(tes, dim=0)  # (B,768)
        y = torch.stack(ys, dim=0)  # (B,)
        return x, te, y

def train(epochs: int = 2, batch_size: int = 4, lr: float = 1e-3):
    device = torch.device("cpu")
    db = SessionLocal()
    try:
        ids = [p.id for p in db.query(Patient).all()]
        if not ids:
            raise RuntimeError("No patients available to train")
        ds = ICUTrainDataset(db, ids)
        dl = DataLoader(ds, batch_size=batch_size, shuffle=True, collate_fn=Collate())
        model = CombinedModel().to(device)
        opt = torch.optim.Adam(model.parameters(), lr=lr)
        loss_fn = nn.BCELoss()
        model.train()
        for ep in range(epochs):
            total = 0.0
            n = 0
            for x, te, y in dl:
                x, te, y = x.to(device), te.to(device), y.to(device)
                opt.zero_grad()
                out = model(x, te)
                loss = loss_fn(out, y)
                loss.backward()
                opt.step()
                total += loss.item() * x.size(0)
                n += x.size(0)
            print(f"epoch {ep+1}/{epochs} loss {total/max(n,1):.4f}")
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        torch.save(model.state_dict(), MODEL_PATH)
        print(f"Saved model to {MODEL_PATH}")
    finally:
        db.close()

if __name__ == "__main__":
    train()
