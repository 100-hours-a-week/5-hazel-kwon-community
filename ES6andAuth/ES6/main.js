document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('posts-container');
    const profileImage = document.getElementById('profileImage');
    let users = [];
    let count = 1; 

    const formatNumber = number => (number >= 100000) ? `${(number / 1000).toFixed(0)}K` : (number >= 1000) ? `${(number / 1000).toFixed(1)}K` : number;

    const generatePostTitle = baseTitle => baseTitle.length > 26 ? `${baseTitle.substring(0, 26)}...` : baseTitle;

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/users');
            users = await response.json();
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:3000/posts');
            const posts = await response.json();

            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'container';
                const postTitle = generatePostTitle(post.posttitle, count);

                const user = users.find(user => user.nickName === post.nickName);
                const profileSrc = user ? user.chooseFile : 'circle.png';

                postElement.innerHTML = `
                    <a href="http://localhost:8000/detail.html?postId=${post.postId}"><h1 id="posttitle">${postTitle}</h1></a>
                    <div class="footer">
                        <div class="count">
                            <span id="likes"> 좋아요 ${formatNumber(post.likes)}</span> &nbsp;
                            <span id="comments">댓글 수 ${formatNumber(post.comments)}</span> &nbsp;
                            <span id="views">조회수 ${formatNumber(post.views)}</span>
                        </div>
                        <div class="datetime">${post.datetime}</div>
                    </div>
                    <hr class="horizontal-rule"/>
                    <img src="${profileSrc}" width="36px" height="36px"> <small id="nickName">${post.nickName}</small>
                `;
                container.appendChild(postElement);
                count++;
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    await fetchUsers();
    fetchPosts();
});

window.addEventListener('scroll', () => {
    const scrollHeight = window.innerHeight + window.scrollY;
    const documentHeight = document.body.offsetHeight;
});
