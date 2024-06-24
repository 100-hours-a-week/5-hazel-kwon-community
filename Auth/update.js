document.addEventListener('DOMContentLoaded', async () => {
    let userEmail = '';
    let userChooseFile = '';

    // 세션에서 사용자 정보 가져오기
    try {
        const sessionResponse = await fetch('http://localhost:3000/session', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            userChooseFile = sessionData.user.chooseFile;
            userEmail = sessionData.user.email;
        } else {
            throw new Error('사용자 정보를 가져올 수 없습니다.');
        }
    } catch (error) {
        console.error('Error fetching session data:', error);
        alert('사용자 정보를 가져올 수 없습니다.');
        return;
    }

    // 사용자 정보 가져오기 함수
    const fetchUserData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/users/${userEmail}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const user = await response.json();
            if (user) {
                document.getElementById('email').textContent = user.email;
                document.getElementById('nickName').value = user.nickName || '';
                if (user.chooseFile) {
                    const imageUrl = user.chooseFile.startsWith('http') ? user.chooseFile : `/uploads/${user.chooseFile}`;
                    document.getElementById('chooseFile').src = imageUrl;
                }
            } else {
                alert("User not found");
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    await fetchUserData();

    document.getElementById('updateForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').textContent;
        const nickName = document.getElementById('nickName').value;
        const chooseFile = document.getElementById('chooseFile').files[0];

        if (!nickNamecheck(nickName)) {
            return;
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('nickName', nickName);
        if (chooseFile) {
            formData.append('chooseFile', chooseFile);
        }

        try {
            const response = await fetch(`http://localhost:3000/users/${email}`, {
                method: "PATCH",
                body: formData,
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.message === 'User updated') {
                toast('수정 완료');
                await fetchUserData(); // 데이터 업데이트 후 다시 불러오기
            } else {
                alert('수정 실패');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('수정하지 못했습니다. 다시 시도해주세요.');
        }
    });

    // 프로필 사진 유효성 검사 함수
    window.loadFile = input => {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = event => {
            const previewImage = document.getElementById('previewImage');
            previewImage.src = event.target.result;
            previewImage.style.objectFit = "contain";
            previewImage.style.borderRadius = "70%";
        };
        reader.readAsDataURL(file);
    };

    // 닉네임 유효성 검사
    const nickNamecheck = nickName => {
        if (!nickName) {
            alert("*닉네임 입력은 필수입니다.");
            return false;
        }
        if (/\s/.test(nickName)) {
            alert("*띄어쓰기를 없애주세요");
            return false;
        }
        if (nickName.length < 2 || nickName.length > 10) {
            alert("*닉네임은 최대 10자까지 작성 가능합니다.");
            return false;
        }
        return true;
    };

    // 수정 완료 토스트 메시지 표시
    window.toast = message => {
        const toastElement = document.getElementById("toast");

        if (toastElement.classList.contains("reveal")) {
            clearTimeout(removeToast);
            removeToast = setTimeout(() => {
                toastElement.classList.remove("reveal");
            }, 1000);
        } else {
            removeToast = setTimeout(() => {
                toastElement.classList.remove("reveal");
            }, 1000);
        }
        toastElement.classList.add("reveal");
        toastElement.innerText = message;
    };

    // 회원 탈퇴 모달 창 열기
    const modal = document.querySelector('.modal');
    const modalOpen = document.querySelector('.button2');
    const modalClose = document.querySelector('.close_btn');
    const mdClose = document.querySelector('.yes_btn');

    modalOpen.addEventListener('click', function () {
        modal.style.display = 'block';
    });

    modalClose.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    mdClose.addEventListener('click', async function () {
        try {
            const email = document.getElementById('email').textContent;
            const response = await fetch(`http://localhost:3000/users/${email}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                alert('탈퇴 처리되었습니다.');
                window.location.href = "login.html";
            } else {
                alert('회원 탈퇴 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('회원 탈퇴 중 오류가 발생했습니다.');
        } finally {
            modal.style.display = 'none';
        }
    });

    // 회원정보 수정
    document.getElementById('update').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/update';
    });

    // 비밀번호 수정
    document.getElementById('pwchange').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/pwchange';
    });

    // 로그아웃
    document.getElementById('logout').addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/logout', {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            if (data.status === 200) {
                alert('로그아웃 되었습니다.');
                window.location.href = '/login';
            } else {
                alert('로그아웃 중 문제가 발생했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('서버에 연결할 수 없습니다.');
        }
    });
});