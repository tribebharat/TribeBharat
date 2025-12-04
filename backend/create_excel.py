import pandas as pd
import os

data = {
    "Product Name": [
        "Bharat Before Newton T-Shirt",
        "Devnagri T-Shirt",
        "Threads of Culture T-Shirt"
    ],
    "Design Theme": [
        "Ancient Indian laws of motion – Before Newton There Was Bharat",
        "Banaras city illustration with Devnagri Hindi typography",
        "Threads of Culture slogan with Indian cityscape illustration"
    ],
    "Fabric": [
        "Cotton Lycra Premium",
        "Cotton Lycra Premium",
        "Cotton Lycra Premium"
    ],
    "GSM": [240, 240, 240],
    "Printing Type": [
        "Screen Printing",
        "Screen Printing",
        "Screen Printing"
    ],
    "Color 1": ["Black", "Black", "Black"],
    "Color 2": ["Olive Green", "Olive Green", "Olive Green"],
    "Color 3": ["White", "White", "White"],
    "Color 4": ["Pink", "Pink", "Pink"],
    "Sizes": ["All Sizes", "All Sizes", "All Sizes"],
    "Status": ["Active", "Active", "Active"]
}

df = pd.DataFrame(data)
os.makedirs('data', exist_ok=True)
df.to_excel("data/products.xlsx", index=False)
print("Created data/products.xlsx")
