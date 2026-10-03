from flask import Flask, render_template, request, jsonify
import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = Flask(__name__)

analyzer = SentimentIntensityAnalyzer()

df = pd.read_csv("reviews.csv")


def analyze_sentiment(review):
    score = analyzer.polarity_scores(review)["compound"]

    if score >= 0.05:
        return "Positive"
    elif score <= -0.05:
        return "Negative"
    else:
        return "Neutral"


df["sentiment"] = df["review"].apply(analyze_sentiment)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/products")
def products():
    product_list = sorted(df["product"].unique().tolist())
    return jsonify(product_list)


@app.route("/api/reviews")
def reviews():

    product = request.args.get("product")

    if product:
        result = df[df["product"].str.lower() == product.lower()]
    else:
        result = df

    positive = int((result["sentiment"] == "Positive").sum())
    negative = int((result["sentiment"] == "Negative").sum())
    neutral = int((result["sentiment"] == "Neutral").sum())

    review_data = result[
        ["product", "review", "rating", "sentiment"]
    ].to_dict(orient="records")

    return jsonify({
        "reviews": review_data,
        "positive": positive,
        "negative": negative,
        "neutral": neutral,
        "total": len(result)
    })


if __name__ == "__main__":
    app.run(debug=True)