
const apiKey = "49774f524b70657436386f63664442";

const proxyUrl = "https://cors-anywhere-2021810071.onrender.com/";

const apiUrl =
    `http://openapi.seoul.go.kr:8088/${apiKey}/json/culturalEventInfo/1/1000`;

const url = proxyUrl + apiUrl;

let dataDiv = document.getElementById("dataDiv");
let watchButton = document.getElementById("what");
let gu = document.getElementById("gu");

window.onload = function () {
    getEvent();
};

async function getEvent() {
    dataDiv.innerHTML = "";

    let selectedCategory = gu.options[gu.selectedIndex].value;

    if (selectedCategory === "") {
        return;
    }

    dataDiv.textContent = "공연 정보를 불러오는 중입니다.";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("HTTP 오류: " + response.status);
        }

        let data = await response.json();

        if (!data.culturalEventInfo || !data.culturalEventInfo.row) {
            throw new Error("공연 정보를 가져올 수 없습니다.");
        }

        let eventList = data.culturalEventInfo.row;
        dataDiv.innerHTML = "";

        let count = 0;

        for (var i = 0; i < eventList.length; i++) {
            if (selectedCategory === eventList[i].CODENAME) {
                const event = eventList[i];

                const div = document.createElement("div");
                div.className = "card event-card";

                const img = document.createElement("img");
                img.className = "card-img-top";
                img.alt = "공연 포스터";
                img.loading = "lazy";

                if (event.MAIN_IMG) {
                    img.src = event.MAIN_IMG.replace(/^http:/, "https:");
                }

                const body = document.createElement("div");
                body.className = "card-body";

                const title = document.createElement("p");
                title.className = "card-text";
                title.textContent = "제목: " + (event.TITLE || "");

                const date = document.createElement("p");
                date.className = "card-text";
                date.textContent = "공연기간: " + (event.DATE || "");

                const place = document.createElement("p");
                place.className = "card-text";
                place.textContent = "공연장: " + (event.PLACE || "");

                const link = document.createElement("a");
                link.className = "btn btn-outline-primary btn-sm";
                link.textContent = "홈페이지 바로가기";
                link.target = "_blank";
                link.rel = "noopener noreferrer";

                if (event.ORG_LINK) {
                    link.href = event.ORG_LINK;
                } else {
                    link.classList.add("disabled");
                    link.setAttribute("aria-disabled", "true");
                }

                body.appendChild(title);
                body.appendChild(date);
                body.appendChild(place);
                body.appendChild(link);

                div.appendChild(img);
                div.appendChild(body);

                dataDiv.appendChild(div);
                count++;
            }
        }

        if (count === 0) {
            dataDiv.textContent = "해당 공연 분야의 정보가 없습니다.";
        }

    } catch (error) {
        console.error(error);
        dataDiv.textContent = "공연 정보를 불러오지 못했습니다.";
    }
}

watchButton.addEventListener("click", () => {
    getEvent();
});
