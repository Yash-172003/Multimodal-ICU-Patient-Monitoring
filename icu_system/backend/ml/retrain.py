from .train_model import train

if __name__ == "__main__":
    # Quick retrain with minimal epochs
    train(epochs=1, batch_size=4, lr=1e-3)
