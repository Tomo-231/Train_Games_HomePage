const apiUrl =
  "https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&daily=weather_code,sunset,snowfall_sum&hourly=temperature_2m,weather_code,snowfall,rain,precipitation_probability&timezone=Asia%2FTokyo";

const targetDate = "2026-01-12";
const tbody = document.getElementById("weatherBody");

// ---- 天気コード判定 ----
function weatherInfo(code) {
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { text: "雪", className: "snow" };
  }
  if ([61, 63, 65].includes(code)) {
    return { text: "雨", className: "rain" };
  }
  if ([0, 1].includes(code)) {
    return { text: "晴れ", className: "" };
  }
  if ([2, 3].includes(code)) {
    return { text: "曇り", className: "" };
  }
  return { text: "不明", className: "" };
}

// ---- JSON取得 ----
fetch(apiUrl)
  .then(response => response.json())
  .then(openMeteoData => {

    openMeteoData.hourly.time.forEach((time, i) => {
      if (!time.startsWith(targetDate)) return;

      const info = weatherInfo(openMeteoData.hourly.weather_code[i]);

      const tr = document.createElement("tr");
      tr.className = info.className;

      tr.innerHTML = `
        <td>${time.slice(11)}</td>
        <td>${openMeteoData.hourly.temperature_2m[i]}</td>
        <td>${info.text}</td>
        <td>${openMeteoData.hourly.rain[i]}</td>
        <td>${openMeteoData.hourly.snowfall[i]}</td>
        <td>${openMeteoData.hourly.precipitation_probability[i]}</td>
      `;

      tbody.appendChild(tr);
    });

  })
  .catch(err => console.error("取得エラー", err));