const likeHeart = document.querySelectorAll('.likedbybutton')

likeHeart.forEach((heart) => {
    heart.addEventListener('click', (e) => {
        const id = e.target.dataset.id
        return axios.post("/like", { id: id })
            .then((res) => {
                if (res.status == 200) {
                    heart.src = "../static/images/likedBy.png"
                } else {
                    heart.src = "../static/images/notLikedBy.png"
                }
            })
    })
})
