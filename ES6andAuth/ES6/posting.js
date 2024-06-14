document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('button');
    if (button) {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
  
            const posttitle = document.getElementById('posttitle').value;
            const content = document.getElementById('content').value;
            const chooseFile = document.getElementById('chooseFile').files[0];
  
            if (posttitle === "" || content === "") {
                alert("*제목, 내용을 모두 작성해주세요");
                return;
            }
  
            const post = {
                posttitle: posttitle,
                content: content,
                nickName: "kakao", // 작성자 정보를 필요에 따라 수정하세요.
                datetime: new Date().toISOString(),
                chooseFile: chooseFile ? URL.createObjectURL(chooseFile) : null
            };
  
            fetch(`http://localhost:3000/posts`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(post)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('서버에서 오류가 발생했습니다.');
                }
            })
            .then(data => {
                alert('게시글이 성공적으로 등록되었습니다.');
                window.location.href = `http://localhost:8000/detail.html?postId=${data.postId}`; // 게시글 상세 페이지로 리디렉션
            })
            .catch(error => {
                console.error('Error:', error);
                alert('게시글 등록 중 오류가 발생했습니다.');
            });
        });
    } else {
        console.error('Submit button not found');
    }
});
