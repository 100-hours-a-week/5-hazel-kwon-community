document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('posts-container');
    const profileImage = document.getElementById('profileImage');
    const users =[];
    let count = 1; // 게시글 카운트 초기화

    // 숫자 형식 변환 함수
    const formatNumber = (number) => {
        if (number >= 100000) {
            return (number / 1000).toFixed(0) + 'K';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        } else {
            return number;
        }
    };

    // 게시글 제목 생성 함수
    const generatePostTitle = (baseTitle) => {
        const maxLength = 26;
        const title = baseTitle;

        // 제목이 26자를 초과하는 경우, 26자까지 자르고 '...'을 붙임
        if (title.length > maxLength) {
            return title.substring(0, maxLength) + '...';
        } else {
            return title;
        }
    };

    
    // 사용자 데이터를 받아와서 users 배열에 저장하는 함수
    const fetchUsers = () => {
        return fetch('http://localhost:3000/users')
            .then(response => response.json())
            .then(data => {
                users = data;
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
    };

    // 게시글 데이터를 받아와서 화면에 표시하는 함수
    const fetchPosts = () => {
        fetch('http://localhost:3000/posts')
            .then(response => response.json())
            .then(posts => {
                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'container';
                    const postTitle = generatePostTitle(post.posttitle, count);

                    // 해당 게시글의 작성자 정보를 users 배열에서 찾기
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

                    // 다음 게시글을 위해 카운트 증가
                    count++;
                });
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    };

    // 초기 게시글 로드
    fetchPosts();
});

// 무한 스크롤
window.addEventListener('scroll', () => {
    // 현재 스크롤 위치
    const scrollHeight = window.innerHeight + window.scrollY;
    // 문서 전체 높이
    const documentHeight = document.body.offsetHeight;
});
