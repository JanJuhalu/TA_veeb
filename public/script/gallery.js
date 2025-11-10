window.onload = function(){
    //käin lhe läbi ja teen listi kõigist thumbs klassiga pisipiltidest
    let allThumbs = document.querySelector("#gallery").querySelectorAll(".thumbs");
    //kõik thumbs klassiga kogusin kokku 
    //määran ära kõigile funktsiooni, mis käivitatakse hiireklikiga
    for (let i = 0; i < allThumbs.length; i ++){
        allThumbs[i].addEventListener("click", openModal);

    }
    document.querySelector("#modalClose").addEventListener("click", closeModal);
    document.querySelector("#modalImage").addEventListener("click", closeModal);

}

function openModal(e){
    document.querySelector("#modalImage").src="/gallery/normal/" + e.target.dataset.filename;
    document.querySelector("#modalCaption").innerHTML = e.target.alt;
    document.querySelector("#modal").showModal();
}

function closeModal(){
    document.querySelector("#modal").close();
    document.querySelector("#modalImage").src = "/image/empty.png";
    document.querySelector("#modalCaption").innerHTML = "galeriipilt";

}