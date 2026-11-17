
exports.handler = async function () {
    const apiKey = process.env.SEOUL_API_KEY;

    if (!apiKey) {
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                error: "SEOUL_API_KEY 환경변수가 설정되지 않았습니다."
            })
        };
    }

    const url =
        `http://openapi.seoul.go.kr:8088/${apiKey}/json/culturalEventInfo/1/1000`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("HTTP 오류: " + response.status);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        return {
            statusCode: 502,
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                error: "서울시 API 요청에 실패했습니다."
            })
        };
    }
};
