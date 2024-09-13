<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Apache License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/josephHelfenbein/travel-amulet">
    <img src="/public/travelamulet-icon.svg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">TravelAmulet</h3>

  <p align="center">
    Discover your perfect travel destination with TravelAmulet. Your preferences guide the journey, and AI guides the adventure.
    <br />
    <br />
    <a href="https://travelamulet.vercel.app">Visit</a>
    ·
    <a href="https://github.com/josephHelfenbein/travel-amulet/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/josephHelfenbein/travel-amulet/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About the Project
### What is TravelAmulet solving?

Many beautiful locations around the world go under the radar for travel and tourism. Sometimes, people just can't decide where to spend their vacation. This project aims to bring countries into the spotlight in a convenient and fun way.

### How does it work?

The user has the option to sign in using credentials, Google, or GitHub. Afterwards, the user can configure their account to include the country that they're in currently.

Even without an account, the user is able to then do the quiz. If logged in, the user can save their progress. The quiz has many different preferences to adjust in terms of importance to the user,
including food spiciness level, language spoken, political stability, LGBTQ+ equality, climate temperature, and more. 

Countries that have a US Department of State travel advisory of Level 4 "Do Not Travel" on the entire country or on parts of the country are automatically excluded. However, they're able to be reincluded by the user if they choose. 
The country that the user is currently in, if signed in, is also excluded automatically for convenience.

After the quiz is taken, a request is sent to a separate Vercel instance that uses Flask and Python to feed the quiz preferences into TiDB Vector Search. The data of all countries available on
<a href="https://countrywise.io/">CountryWise API</a> has already been put into the TiDB MySQL database. The country is then returned and put into local storage, along with a prompt string made from the quiz preferences.

The user is then redirected to the results page, where the top 10 results are shown in order of most to least matching. The data from CountryWise API is shown in different sections to give the user an overview
of the country. The prompt string is also fed into the OpenAI API, which then uses GPT-4o mini to explain how the country fits the quiz preferences.

If signed in, every result shown to the user is saved and visible on the account settings page.

A list of cities found in the country is available on the bottom of the page, which redirect to a hotel and flights page. A map of the city is shown, and the nearest airport is found. The nearest hotels are also found and displayed to search for more information. If entering your location into the input field, the nearest airport to you will be found, and you can search for flight prices from the airport to the city.




### Built With

* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![ThreeJS][ThreeJS]][ThreeJS-url]
* [![MySQL][MySQL]][MySQL-url]
* [![Prisma][Prisma]][Prisma-url]
* [![OpenAI][OpenAI]][OpenAI-url]
* [![Flask][Flask]][Flask-url]
* [![Google][Google]][Google-url]
* [![Amadeus][Amadeus]][Amadeus-url]

### Powered By

* <a href="https://tidbcloud.com/free-trial">TiDB Cloud Serverless</a>
* <a href="https://vercel.com">Vercel</a>



<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- GETTING STARTED -->
## Getting Started

Here are the steps to run the project locally if you want to develop your own project.

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```


### Installation

1. Create a TiDB Cloud Serverless account at [https://tidbcloud.com/free-trial](https://tidbcloud.com/free-trial)
2. Get an OpenAI API key at [https://openai.com/api](https://openai.com/api)
3. Follow <a href="https://docs.pingcap.com/tidbcloud/vector-search-integrate-with-langchain">this tutorial</a> on a separate instance to get TiDB Vector Search running. The instance can be hosted on <a href="https://vercel.com">Vercel</a> using Python and Flask. Alternatively, you can also follow <a href="https://docs.pingcap.com/tidbcloud/vector-search-get-started-using-sql">this tutorial</a> to run TiDB Vector Search on the same Next.js instance using SQL, but you would have to generate the vector embeddings separately. The country data used for the vector embeddings is from [https://countrywise.io](https://countrywise.io), and all the files that were used to create them can be found at [https://github.com/josephHelfenbein/travel-amulet/tree/main/Vector%20Search](https://github.com/josephHelfenbein/travel-amulet/tree/main/Vector%20Search). The country info data can be generated and put into the database in a similar way.

> **Note:** The Python API for vector search can be accessed [here](https://github.com/YashedP/travel-amulet-backend-server). You can deploy this API to a background server or use the link directly in your project.

5. If you want to use Sign in with Google or GitHub, you'll need to set up those services. Sign in with Google can be set up at [https://console.cloud.google.com](https://console.cloud.google.com), and GitHub at [https://github.com/settings/developers](https://github.com/settings/developers).
6. To get the places, flights and hotels for results working, you'll need to get an API key from [https://developers.google.com/maps](https://developers.google.com/maps), and an API key from [https://developers.amadeus.com](https://developers.amadeus.com).
7. Clone the repo
   ```sh
   git clone https://github.com/josephHelfenbein/travel-amulet.git
   ```
8. Install NPM packages
   ```sh
   npm install
   ```
9. Enter your API keys and database URL in a `.env.local` file
   ```js
       DATABASE_URL = "ENTER YOUR DATABASE URL"
       OPENAI_API_KEY = "ENTER YOUR OPENAI API KEY"
       NEXTAUTH_URL = "ENTER YOUR URL (http://localhost:3000 if running locally)"
       NEXTAUTH_SECRET = "ENTER YOUR NEXTAUTH SECRET KEY"
   
       GITHUB_CLIENT_ID = "ENTER YOUR GITHUB CLIENT ID" 
       GITHUB_CLIENT_SECRET = "ENTER YOUR GITHUB SECRET KEY"
       GOOGLE_CLIENT_ID = "ENTER YOUR GOOGLE CLIENT ID"
       GOOGLE_CLIENT_SECRET = "ENTER YOUR GOOGLE SECRET KEY"

       NEXT_PUBLIC_GOOGLE_MAPS_KEY = "ENTER YOUR GOOGLE MAPS API KEY"
       AMADEUS_KEY = "ENTER YOUR AMADEUS API KEY"
       AMADEUS_SECRET = "ENTER YOUR AMADEUS API SECRET KEY"
   ```
10. Create user database
   ```sh
   yarn prisma migrate dev
   ```
11. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin josephHelfenbein/travel-amulet
   git remote -v # confirm the changes
   ```
11. You can run the website locally with
    ```sh
    npm run dev
    ```
    or, if hosting on Vercel, with
    ```sh
    vercel dev
    ```








<!-- LICENSE -->
## License

Distributed under the Apache 2.0 License. See `LICENSE.txt` for more information.



<!-- CONTACT -->
## Contact

Joseph Helfenbein - [![LinkedIn][linkedin-shield]][linkedin-url-joseph] - josephhelfenbein@gmail.com

Yash Jani - [![LinkedIn][linkedin-shield]][linkedin-url-yash] - yashjani144@gmail.com


This project was submitted to the TiDB Future App Hackathon 2024 hackathon. Devpost link: [https://devpost.com/software/travelamulet](https://devpost.com/software/travelamulet)

Project Link: [https://github.com/josephHelfenbein/travel-amulet](https://github.com/josephHelfenbein/travel-amulet)

* [Best README Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/josephHelfenbein/travel-amulet.svg?style=for-the-badge
[contributors-url]: https://github.com/josephHelfenbein/travel-amulet/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/josephHelfenbein/travel-amulet.svg?style=for-the-badge
[forks-url]: https://github.com/josephHelfenbein/travel-amulet/network/members
[stars-shield]: https://img.shields.io/github/stars/josephHelfenbein/travel-amulet.svg?style=for-the-badge
[stars-url]: https://github.com/josephHelfenbein/travel-amulet/stargazers
[issues-shield]: https://img.shields.io/github/issues/josephHelfenbein/travel-amulet.svg?style=for-the-badge
[issues-url]: https://github.com/josephHelfenbein/travel-amulet/issues
[license-shield]: https://img.shields.io/github/license/josephHelfenbein/travel-amulet.svg?style=for-the-badge
[license-url]: https://github.com/josephHelfenbein/travel-amulet/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-0A66C2.svg?style=for-the-badge&logo=linkedin&logoColor=white
[linkedin-url-joseph]: https://linkedin.com/in/joseph-j-helfenbein
[linkedin-url-yash]: https://linkedin.com/in/yash-jani-8245bb26a/
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
[JavaScript]: https://img.shields.io/badge/javascript-yellow?logo=javascript&style=for-the-badge&logoColor=white
[JavaScript-url]: https://developer.oracle.com/languages/javascript.html
[ThreeJS]: https://img.shields.io/badge/three.js-black?logo=three.js&style=for-the-badge&logoColor=white
[ThreeJS-url]: https://threejs.org/
[TypeScript]: https://img.shields.io/badge/typescript-3178C6?logo=typescript&style=for-the-badge&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[MySQL]: https://img.shields.io/badge/mysql-4479A1?logo=mysql&style=for-the-badge&logoColor=white
[MySQL-url]: https://www.mysql.com/
[OpenAI]: https://img.shields.io/badge/openai%20api-black?logo=openai&style=for-the-badge&logoColor=white
[OpenAI-url]: https://openai.com/api/
[Prisma]: https://img.shields.io/badge/prisma-2D3748?logo=prisma&style=for-the-badge&logoColor=white
[Prisma-url]: https://www.prisma.io/
[Flask]: https://img.shields.io/badge/flask-4590A1?logo=flask&style=for-the-badge&logoColor=white
[Flask-url]: https://flask.palletsprojects.com/en/3.0.x/
[Google]: https://img.shields.io/badge/google%20maps%20api-4285F4?logo=google%20maps&style=for-the-badge&logoColor=white
[Google-url]: https://developers.google.com/maps
[Amadeus]: https://img.shields.io/badge/amadeus%20api-1b69bc.svg?logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iNjkuMjY3NjI0IiBoZWlnaHQ9Ijg0LjgxODM3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNjkuMjY3NjI0IDg0LjgxODM3NSI+PHBhdGggZD0iTSA1MS4xMjgzNzUsNjUuODUyMTI1IEMgNDcuMjQwNzUsNjcuMzg0MjUgMzcuODE1LDcwLjQ0Njc1IDMwLjg2NjI1LDcwLjQ0Njc1IGMgLTcuNTQwMTI1LDAgLTEzLjE5Mzg3NSwtMi41OTEyNSAtMTMuMTkzODc1LC0xMC44MzgzNzUgMCwtNy4xODUgMy44ODUyNSwtMTEuMzA3NjI1IDE0LjI1NTM3NSwtMTEuNjYxNjI1IGwgMTkuMjAwNjI1LC0wLjcwNjUgeiBNIDQwLjI5LDAgQyAyNC4wMzMyNSwwIDExLjMxMDU1LDQuMDA2Mzc1IDYuMzYyMyw2LjQ4MSBsIDMuODg4MTg4LDEzLjY2NDUgYyAwLDAgMTIuNDg4NzYyLC00LjQ3NiAyNC43Mzc3NjIsLTQuNDc2IDEwLjQ4NDg3NSwwIDE1LjkwMjg3NSwyLjk0Mzc1IDE1LjkwMjg3NSwxMy4zMSB2IDUuODkxNjI1IEggMzQuOTg4MjUgQyA4LjAxMjIxMjUsMzQuODcxMTI1IDAsNDcuMjQwMjUgMCw2MC45MDU3NSBjIDAsMTguMTM5Njc1IDE0LjEzNzc1LDIzLjkxMjYyNSAyNi45NzgsMjMuOTEyNjI1IDE0Ljk2MDUsMCAyMy42NzkyNSwtNi4yNDI2NzUgMjQuNzM4MjUsLTYuMjQyNjc1IDAuODI1NzUsMCAzLjg4ODI1LDMuMjk2ODc1IDE3LjU1MTM3NSwzLjI5Njg3NSB2IC01Ny43MjIyIEMgNjkuMjY3NjI1LDYuODM1IDU4LjU0OTM3NSwwIDQwLjI5LDAgWiIgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4xMjUiIC8+PC9zdmc+Cg==&style=for-the-badge&logoColor=white
[Amadeus-url]: https://developers.amadeus.com/
