All\_Impressions.csv
--------------------

-   **Data Collection Method**: Web scraped data from all of the "Impressions" pages on www.snlarchives.net
-   **Observations**: Each row represents a single Character/Actor combination for a sketch on a specific day
-   **Variables**:
    -   *Character*: Name of person being impersonated
    -   *Actor*: Saturday Night Live actor or actress who is impersonating a character
    -   *AirDate*: Date (in %Y-%m-%d format) when the episode originally aired
    -   *Sketch*: Name of the specific sketch (i.e., act or skit) in which the actor portrayed a character
-   **Other Notes**: Data is maintained on snlarchives.net by [Joel Navaroli](https://twitter.com/snlmedia). If you use these data, make sure to give him a shout out :)

------------------------------------------------------------------------

Character\_Categories.csv
-------------------------

-   **Data Collection Method**: Collected list of unique characters impersonated from All\_Impressions.csv file. Created a script using Wikipedia's API to search for each name and retrieve part of the first sentence on the page. This sentence generally gives a brief overview to the person and is most likely to give helpful information about who a characer is. Categories were then used to automatically classify people into characters based on what they are most commonly known for.
-   **Observations**: Each row represents a single Character
-   **Variables**:
    -   *name*: Name of person being impersonated (can be used as a key with the Character column of All\_Impressions.csv file)
    -   *occupation*: part of the first sentence scrape from Wikipedia
    -   *Category*: general grouping of similar reasons for fame (see more detailed descriptions below)
-   **Other Notes**: Not every character had a page on Wikipedia. These had to be searched on Google or other sources to try to discertain information about the original person. If you see errors, please let me know.

**Categories**: Categories were decided based on which categorization is the **most** appropriate for a given character, specifically in regards to why they were featured on SNL.

-   **Acting Entertainer**: includes all occupations involved with television, theater, and movie performances (e.g., actor, actress, producer, director, comedian, playwright)
-   **Athlete**: includes all occupations involved with playing or coaching a sport or athletic event (does not include owning a sporting team)
-   **Athlete / News Entertainer**: includes all athletes (or former athletes) who are also now sportscasters or commentators (this was a large enough group that I decided to make it its own category)
-   **British Royal Family**: includes all members of the British Royal Family (i.e., those related to Queen Elizabeth II)
-   **Business Leader**: includes all people whose primary occupation was businessman, businesswoman, CEO, or president of a company. Owners of companies and sports teams are included in this category.
-   **Criminal**: includes all people who were convicted of a crime and who were featured on SNL because of this crime (e.g., some people are convicted criminals now, but were featured on SNL because they were an actor, not because they were a criminal.) People whose crimes were pardoned or those who died before trial are not included here
-   **Fashion Industry**: anyone involved in the fashion industry (note: competitors in Reality TV fashion shows like Project Runway are not included here since they were impersonated on SNL because they were on the show, making them Reality TV Stars)
-   **Inventor**: making up a very small list, this category includes people whose primary claim-to-fame was inventing a product
-   **Law Professional**: includes anyone involved with the judicial process (i.e., lawyers, attorneys, judges etc.)
-   **Musical / Acting Entertainer**: includes anyone involved in **both** the Acting Entertainer category AND the Musical Entertainer category (i.e., someone who is both a singer and actor would fall in this category)
-   **News Entertainer**: includes anyone involved in media that includes talk shows, news segments, gossip columnists, game shows, journalists and hosting of anything.
-   **Non-U.S. Politician**: includes anyone whose primary occupation is/was politics in any country outside of the United States
-   **Other Entertainer**: includes any kind of entertainer that doesn't fall into the Acting, Musical, News, or Reality TV categories. This includes magicians, celebrity chefs, pornographers, infomercial personalities and models.
-   **Reality TV Star**: includes anyone whose claim-to-fame comes from a Reality TV program. This includes contestants on shows (e.g., Survivor, Project Runway, Rock of Love etc.) and those with their own shows (e.g., Kardashians, Paris Hilton etc.)
-   **Religious Figure**: includes anyone who is a figure within their religion. Due to the lax definition, this includes figures from major religions and from cult-like religions.
-   **Scientist**: anyone for whom science derives their fame
-   **U.S. Political Family**: anyone who is a family member of a U.S. politician and is impersonated on SNL *because* of this relationship
-   **U.S. Politician**: anyone involved in United States politics. Includes all elected officials (e.g., mayors, senators, governors, vice presidents, presidents) and those that contribute to their work (e.g., chiefs of staff, press secretary, personal secretaries, etc.)
-   **Writer**: anyone whose primary reason for being impersonated is writing poetry, novels, textbooks etc. This category *does not* include screenwriters, playwrights, songwriters etc.
-   **other**: anyone who doesn't fit into any of the above categories
