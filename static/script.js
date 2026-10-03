let sentimentChart;


// Load products when website opens

async function loadProducts() {

    const response = await fetch("/api/products");

    const products = await response.json();

    const select = document.getElementById("productSelect");

    products.forEach(product => {

        const option = document.createElement("option");

        option.value = product;
        option.textContent = product;

        select.appendChild(option);
    });
}


// Analyze selected product

async function analyzeProduct() {

    const product =
        document.getElementById("productSelect").value;

    if (!product) {

        alert("Please select a product");

        return;
    }


    const response =
        await fetch(
            `/api/reviews?product=${encodeURIComponent(product)}`
        );

    const data = await response.json();


    // Update statistics

    document.getElementById("total").textContent =
        data.total;

    document.getElementById("positive").textContent =
        data.positive;

    document.getElementById("negative").textContent =
        data.negative;

    document.getElementById("neutral").textContent =
        data.neutral;


    // Display chart

    createChart(
        data.positive,
        data.negative,
        data.neutral
    );


    // Display reviews

    displayReviews(data.reviews);
}


// Create chart

function createChart(positive, negative, neutral) {

    const ctx =
        document.getElementById("sentimentChart");

    if (sentimentChart) {

        sentimentChart.destroy();

    }


    sentimentChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [
                "Positive",
                "Negative",
                "Neutral"
            ],

            datasets: [{

                data: [
                    positive,
                    negative,
                    neutral
                ]

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    position: "bottom"
                }

            }

        }

    });
}


// Display reviews

function displayReviews(reviews) {

    const container =
        document.getElementById("reviewsContainer");

    container.innerHTML = "";


    reviews.forEach(item => {

        const div =
            document.createElement("div");

        div.className = "review";


        const sentimentClass =
            item.sentiment.toLowerCase();


        div.innerHTML = `

            <h3>
                ${item.product}
            </h3>

            <p>
                ${item.review}
            </p>

            <p>
                Rating: ${item.rating}/5
            </p>

            <p class="${sentimentClass}">
                Sentiment: ${item.sentiment}
            </p>

        `;


        container.appendChild(div);

    });
}


// Run when page loads

loadProducts();