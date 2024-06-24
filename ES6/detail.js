document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    let isEditing = false;
    let editingCommentId = null;

    if (!postId) {
        alert('유효하지 않은 게시글입니다.');
        return;
    }

    // 게시글 상세 정보 가져오기
    fetch(`http://localhost:3000/posts/${postId}`)
        .then(response => response.json())
        .then(post => {
            document.getElementById('posttitle').innerText = post.posttitle;
            document.getElementById('datetime').innerText = post.datetime;
            document.getElementById('nickName').innerText = post.nickName;
            document.getElementById('content').innerText = post.content;

            if (post.chooseFile) {
                const imageElement = document.getElementById('image');
                imageElement.src = post.chooseFile;
                imageElement.style.display = 'block';
            }

            // 댓글 데이터 가져오기
            return fetch(`http://localhost:3000/posts/${postId}/comments`);
        })
        .then(response => response.json())
        .then(comments => {
            const commentContainer = document.querySelector('.communicateList');
            comments.forEach(comment => {
                const commentElement = document.createElement('article');
                commentElement.className = 'comment';
                commentElement.setAttribute('data-comment-id', comment.commentId);
                commentElement.innerHTML = `
                    <div class="info">
                        <img src="circle.png" width="36px" height="36px">
                        <small>${comment.nickName}</small>
                        <span class="date">${comment.datetime}</span>
                    </div>
                    <div class="controlBtns">
                        <button type="submit" class="cmdelete" name="cmdelete">삭제</button>
                        <div class="cm_modal">
                            <div class="modal_popup">
                                <h3 style="text-align: center;">댓글을 삭제하시겠습니까?</h3>
                                <p>삭제한 내용은 복구할 수 없습니다.</p>
                                <div class="mobt">
                                    <button type="button" class="close_btn">취소</button>
                                    <button type="button" class="yes_btn">확인</button>
                                </div>
                            </div>
                        </div>
                        <button type="submit" class="cmmodify" name="cmmodify">수정</button>
                    </div>
                    <p class="cmcontent">${comment.content}</p>
                `;
                commentContainer.appendChild(commentElement);
            });

            // 댓글 삭제 모달 창 표시 및 삭제 처리
            const cmDeleteElements = document.querySelectorAll('.cmdelete');
            cmDeleteElements.forEach((el) => {
                el.addEventListener('click', (event) => {
                    event.preventDefault(); // 기본 동작 방지

                    // 모달 열기
                    const modal = el.closest('.comment').querySelector('.cm_modal');
                    modal.style.display = 'block';

                    // 확인 버튼 이벤트 처리
                    const confirmButton = modal.querySelector('.yes_btn');
                    confirmButton.addEventListener('click', async () => {
                        const commentElement = el.closest('.comment');
                        const commentId = commentElement.getAttribute('data-comment-id');

                        try {
                            const response = await fetch(`http://localhost:3000/posts/${postId}/comments/${commentId}`, {
                                method: 'DELETE',
                            });

                            if (response.ok) {
                                commentElement.remove(); // 댓글 삭제
                                modal.style.display = 'none'; // 모달 닫기
                                alert('댓글이 삭제되었습니다.');
                            } else {
                                const errorMessage = await response.text();
                                console.error(`Failed to delete comment: ${errorMessage}`);
                                throw new Error('댓글 삭제 중 오류가 발생했습니다.');
                            }
                        } catch (error) {
                            console.error('댓글 삭제 중 오류가 발생했습니다:', error);
                            alert('댓글 삭제 중 오류가 발생했습니다.');
                        }
                    });

                    // 취소 버튼 이벤트 처리
                    const cancelButton = modal.querySelector('.close_btn');
                    cancelButton.addEventListener('click', () => {
                        modal.style.display = 'none'; // 모달 닫기
                    });
                });
            });

            // 댓글 수정
            const cmModifyElements = document.querySelectorAll('.cmmodify');
            cmModifyElements.forEach((button) => {
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    const commentElement = button.closest('.comment');
                    const commentId = commentElement.getAttribute('data-comment-id');
                    const contentElement = commentElement.querySelector('.cmcontent');
                    const originalContent = contentElement.innerText;

                    // 댓글 수정 모드로 전환
                    isEditing = true;
                    editingCommentId = commentId;
                    document.getElementById('comment').value = originalContent;
                    document.getElementById('comment').focus();
                    document.getElementById('button1').innerText = '댓글 수정';
                });
            });
        })
        .catch(error => {
            console.error('댓글 데이터를 불러오는 동안 오류가 발생했습니다:', error);
        });

    // 게시글 수정 버튼 클릭 시 postupdate.html로 이동
    const modifyButton = document.getElementById('postmodify');
    modifyButton.addEventListener('click', () => {
        window.location.href = `http://localhost:8000/postupdate.html?postId=${postId}`;
    });

    // 게시글 삭제 모달 창 표시 및 삭제 처리
    const postdelete = document.getElementById('postdelete');
    postdelete.addEventListener('click', (event) => {
        event.preventDefault();
        const modal = document.querySelector('.po_modal');
        modal.style.display = 'block';

        const confirmButton = modal.querySelector('.yes_btn');
        confirmButton.addEventListener('click', () => {
            fetch(`http://localhost:3000/posts/${postId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    alert('게시글이 성공적으로 삭제되었습니다.');
                    window.location.href = '/main.html'; // 메인 페이지로 리디렉션
                })
                .catch(error => {
                    console.error('게시글 삭제 중 오류가 발생했습니다:', error);
                });
        });

        const cancelButton = modal.querySelector('.close_btn');
        cancelButton.addEventListener('click', () => {
            modal.style.display = 'none'; // 모달 닫기
        });
    });

    // 댓글 등록 및 수정 이벤트 처리
    document.getElementById('button1').addEventListener('click', () => {
        const commentContent = document.getElementById('comment').value;
        if (!commentContent) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        if (isEditing && editingCommentId) {
            const updatedComment = { content: commentContent };

            fetch(`http://localhost:3000/posts/${postId}/comments/${editingCommentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedComment)
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('댓글 수정 중 오류가 발생했습니다.');
                    }
                })
                .then(data => {
                    alert('댓글이 성공적으로 수정되었습니다.');
                    const commentElement = document.querySelector(`.comment[data-comment-id='${editingCommentId}']`);
                    const contentElement = commentElement.querySelector('.cmcontent');
                    contentElement.innerText = commentContent; // 화면에 수정된 댓글 반영

                    // 수정 모드 종료
                    isEditing = false;
                    editingCommentId = null;
                    document.getElementById('comment').value = ''; // 입력 필드 초기화
                    document.getElementById('button1').innerText = '댓글 등록';
                })
                .catch(error => {
                    console.error('댓글 수정 중 오류가 발생했습니다:', error);
                    alert('댓글 수정 중 오류가 발생했습니다.');
                });
        } else {
            const comment = {
                nickName: '현재 사용자', // 현재 사용자 정보로 대체
                datetime: new Date().toISOString(),
                content: commentContent
            };

            fetch(`http://localhost:3000/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(comment)
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('댓글 등록 중 오류가 발생했습니다.');
                    }
                })
                .then(data => {
                    alert('댓글이 성공적으로 등록되었습니다.');
                    window.location.href = `http://localhost:8000/detail.html?postId=${postId}`; // 리디렉션
                })
                .catch(error => {
                    console.error('댓글 등록 중 오류가 발생했습니다:', error);
                });
        }
    });
});