document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    const titleInput = document.getElementById('posttitle');
    const contentInput = document.getElementById('content');
    const chooseFileInput = document.getElementById('chooseFile');

    console.log(`postId: ${postId}`);

    // 현재 게시글 정보를 불러와서 폼에 채우기
    fetch(`http://localhost:3000/posts/${postId}`)
        .then(response => response.json())
        .then(post => {
            titleInput.value = post.posttitle;
            contentInput.value = post.content;
            if (post.chooseFile) {
                chooseFileInput.setAttribute('data-url', post.chooseFile);
            }
            console.log('게시글 정보를 불러왔습니다:', post);
        })
        .catch(error => {
            console.error('게시글 정보를 불러오는 중 오류가 발생했습니다:', error);
        });

    // 제목과 내용을 검증하는 함수
    const validatePost = () => {
        const posttitle = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!posttitle || !content) {
            alert("*제목, 내용을 모두 작성해주세요");
            return false;
        }

        return true;
    };

    document.getElementById('button').addEventListener('click', async (event) => {
        event.preventDefault();

        if (!validatePost()) return;

        const posttitle = titleInput.value.trim();
        const content = contentInput.value.trim();
        const chooseFile = chooseFileInput.files[0];

        const updatedPost = {
            posttitle,
            content,
            datetime: new Date().toISOString(),
            chooseFile: chooseFile ? URL.createObjectURL(chooseFile) : chooseFileInput.dataset.url
        };

        console.log('수정할 게시글 데이터:', updatedPost);

        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPost),
                credentials: 'include'
            });

            if (!response.ok) throw new Error('네트워크 응답이 올바르지 않습니다.');

            const data = await response.json();
            console.log('게시글 수정 응답 데이터:', data);
            alert('게시글이 성공적으로 수정되었습니다.');
            window.location.href = `http://localhost:8000/detail.html?postId=${postId}`;
        } catch (error) {
            console.error('게시글 수정 중 오류가 발생했습니다:', error);
            alert('게시글 수정 중 오류가 발생했습니다.');
        }
    });
});