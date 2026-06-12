import torch
import torch.nn as nn
from transformers import AutoModel, AutoTokenizer
from ..config import settings

class VitalsLSTM(nn.Module):
    def __init__(self, input_size: int = 6, hidden_size: int = 64, num_layers: int = 1):
        super().__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers=num_layers, batch_first=True)

    def forward(self, x):
        out, (hn, cn) = self.lstm(x)
        return hn[-1]

class ClinicalBERTEncoder(nn.Module):
    def __init__(self, model_name: str = None):
        super().__init__()
        self.model_name = model_name or settings.HF_MODEL_NAME
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name, local_files_only=False)
            self.bert = AutoModel.from_pretrained(self.model_name, local_files_only=False)
        except Exception:
            fallback = "distilbert-base-uncased"
            self.tokenizer = AutoTokenizer.from_pretrained(fallback)
            self.bert = AutoModel.from_pretrained(fallback)

    def encode(self, texts):
        enc = self.tokenizer(texts, padding=True, truncation=True, max_length=128, return_tensors="pt")
        out = self.bert(**enc)
        cls = out.last_hidden_state[:, 0, :]
        return cls

class FusionModel(nn.Module):
    def __init__(self, vitals_dim: int = 64, text_dim: int = 768, hidden: int = 128):
        super().__init__()
        self.fc = nn.Sequential(
            nn.Linear(vitals_dim + text_dim, hidden),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(hidden, 1),
            nn.Sigmoid(),
        )

    def forward(self, vitals_emb, text_emb):
        x = torch.cat([vitals_emb, text_emb], dim=-1)
        return self.fc(x).squeeze(-1)

class CombinedModel(nn.Module):
    def __init__(self, text_dim: int = 768):
        super().__init__()
        self.vitals = VitalsLSTM()
        self.fusion = FusionModel(vitals_dim=64, text_dim=text_dim)
        self.text_dim = text_dim

    def forward(self, vitals_seq, text_emb):
        v = self.vitals(vitals_seq)
        r = self.fusion(v, text_emb)
        return r

