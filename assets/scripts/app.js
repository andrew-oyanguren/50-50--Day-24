/* ===== Variables ===== */

// API Request URL
const APIURL = 'https://api.github.com/users/';


const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

//console.log(main)

/* ===== Event LIsteners ===== */

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = '';
  }
})

/* ===== Functions ===== */

async function getUser(username) {
  try {
    const { data } = await axios.get(APIURL + username);

    createUserCard(data);
    getRepos(username);
  } catch (err) {
    if (err.response.status == 404) {
      createErrorCard('No profile with this user name');
    }
  }

}

async function getRepos(username) {
  try {
    const { data } = await axios.get(APIURL + username + '/repos?sort=created');

    addReposToCard(data);
  } catch (err) {
    createErrorCard('Problem fetching repos');
    console.log(err)
  }
}

function createUserCard(user) {
  const cardHTML = `
  <div class="card">
      <div>
        <img class="avatar" src="${user.avatar_url}" alt="avatar">
      </div>
      <div class="user-info">
        <h2>${user.name}</h2>
        <p>${user.bio}</p>
        <ul>
          <li>${user.followers}<strong>Followers</strong></li>
          <li>${user.following} <strong>Following</strong></li>
          <li>${user.public_repos} <strong>Repos</strong></li>
        </ul>

        <div id="repos"></div>
      </div>
    </div>
  `
  main.innerHTML = cardHTML;
}

function createErrorCard(msg) {
  const cardHTML = `
    <div class="card">
      <h1>${msg}</h1>
    </div>
  `

  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposEl = document.getElementById('repos');

  repos
    .slice(0, 6)
    .forEach(repo => {
      const repoEl = document.createElement('a');
      repoEl.classList.add('repo');
      repoEl.href = repo.html_url;
      repoEl.target = '_blank';
      repoEl.innerText = repo.name;

      reposEl.appendChild(repoEl);
    })
}