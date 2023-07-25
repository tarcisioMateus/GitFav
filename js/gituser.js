export class GitUser {
    static search (userLogin) {
        const endpoint = `http://api.github.com/users/${userLogin}`

        return fetch(endpoint).then(data => data.json()).then(({name, login, followers, public_repos}) => ({name, login, followers, public_repos}))
    }
}

