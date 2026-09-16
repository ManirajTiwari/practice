import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

#operation for 1st, 2nd, 3rd

df = pd.read_csv("superstore_excel-selected-columns.csv")
print(df)

df.head()          
df.tail()          
df.shape           
df.columns         
df.index          
df.info()         
df.describe()      
df.dtypes          
df.nunique() 

df.dropna()
df.dropna(axis=1)

df.mean()
df.median()
df.sum()
df.min()
df.max()
df.std()
df.var()
df.quantile()

df.duplicated()
df.drop_duplicates()

df.sort_values("Order Date")
df.sort_values("Ship Date", ascending=False)
df.sort_values("Customer ID")
df.sort_values("Customer ID", ascending=False)


##matplot lib oprations

data = sns.load_dataset("df")
print(df.head())

print("\nFirst 5 Rows for Visualization:")
print(df.head())


# Scatter plot between Order Date and Ship Date
sns.scatterplot(
    data=df,
    x="Order Date",
    y="Ship Date"
)

plt.title("Order Date vs Ship Date")
plt.xlabel("Order Date")
plt.ylabel("Ship Date")

plt.xticks(rotation=45)
plt.tight_layout()

plt.show()