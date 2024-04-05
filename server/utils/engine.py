from bs4 import BeautifulSoup
import requests
from proxy import get_free_proxies
from enum import Enum
import yagooglesearch
import re


class JobSite(Enum):
    LEVER = "lever.co"
    GREENHOUSE = "boards.greenhouse.io"
    ANGELLIST = "TODO"
    WORKABLE = "TODO"
    INDEED = "TODO"
    GLASSDOOR = "TODO"
    LINKEDIN = "TODO"


class TBS(Enum):
    PAST_TWELVE_HOURS = "qdr:h12"
    PAST_DAY = "qdr:d"
    PAST_WEEK = "qdr:w"
    PAST_MONTH = "qdr:m"
    PAST_YEAR = "qdr:y"


def find_jobs(
    keyword: str, job_site: JobSite, tbs: TBS | None, max_results: int = 100
) -> list[str]:
    proxies = [None] + get_free_proxies()
    proxy_index = 0

    success = False
    result = []

    while not success:
        try:
            proxy = proxies[proxy_index]
            proxy_index += 1

            if proxy_index >= len(proxies):
                print("No more proxies to try.")
                break

            search_query = f"{keyword} site:{job_site.value}"
            print(f"Searching for {search_query} using proxy {proxy}")
            client = yagooglesearch.SearchClient(
                search_query,
                tbs=tbs.value if tbs else None,
                max_search_result_urls_to_return=max_results,
                proxy=proxy,
                verbosity=0,
            )
            client.assign_random_user_agent()
            result = client.search()
            success = True
        except Exception as e:
            print(f"Error using proxy {proxy}: ", e)

    cleaner = JobSearchResultCleaner(job_site)
    return cleaner.clean(result)


def get_job_details(link: str) -> list[str]:
    response = requests.get(link)
    soup = BeautifulSoup(response.content, "html.parser")

    title = soup.title.string if soup.title else "Unknown"
    company_name = title.split("-")[0].strip() if "-" in title else title.strip()
    position = title.split("-")[1:]

    img = soup.find("img")
    if img and img != "/img/lever-logo-full.svg":
        img_url = img["src"]
    else:
        img_url = None

    return [company_name, position, img_url]


class JobSearchResultCleaner:
    regex = {
        JobSite.LEVER: r"https://jobs.lever.co/[^/]+/[^/]+",
        JobSite.GREENHOUSE: r"https://boards.greenhouse.io/[^/]+/[^/]+",
        JobSite.ANGELLIST: "TODO",
        JobSite.WORKABLE: "TODO",
        JobSite.INDEED: "TODO",
        JobSite.GLASSDOOR: "TODO",
        JobSite.LINKEDIN: "TODO",
    }

    def __init__(self, job_site: JobSite):
        self.job_site = job_site

    def _prune_urls(self, urls: list[str]) -> list[str]:
        return [
            re.search(self.regex[self.job_site], url).group()
            for url in urls
            if re.search(self.regex[self.job_site], url)
        ]

    def _remove_duplicates(self, urls: list[str]) -> list[str]:
        return list(set(urls))

    def _make_direct_apply_urls(self, urls: list[str]) -> list[str]:
        if self.job_site == JobSite.LEVER:
            # clean the url of all query parameters
            urls = [re.sub(r"\?.*", "", url) for url in urls]
            return [url + "/apply" for url in urls]
        return urls

    def clean(self, job_search_result: list) -> list[str]:
        """Clean the job search result to only include valid job URLs."""
        if not job_search_result:
            return []
        try:
            return self._make_direct_apply_urls(
                self._remove_duplicates(self._prune_urls(job_search_result))
            )
        except Exception as e:
            print(f"Error cleaning job search result: {e}")
            return []
