import requests
from bs4 import BeautifulSoup


def get_free_proxies() -> list[str]:
    url = "https://free-proxy-list.net/"

    try:
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.content, "html.parser")
        table = soup.find(
            "table", attrs={"class": "table table-striped table-bordered"}
        )
        rows = table.find_all("tr")
        proxies = []
        for row in rows:
            cols = row.find_all("td")
            if len(cols) > 0:
                ip = cols[0].text
                port = cols[1].text
                proxy = f"{ip}:{port}"
                proxies.append(proxy)
        return proxies
    except Exception as e:
        print("Error: ", e)
        return []
