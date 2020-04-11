const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.ocuupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');

populateUI();

let ticketPrice = +movieSelect.value; //+sign before makes string to number type
// console.log(ticketPrice); 

//to clear all selected seats
const clear = document.querySelector('.circle');

//to update the confirmation of seats
const payment = document.getElementById('payment');
console.log(payment);

//Update total and count
function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    
    // console.log(selectedSeats);
    const selectedSeatsCounts = selectedSeats.length;
    count.innerText = selectedSeatsCounts;
    total.innerText = selectedSeatsCounts * ticketPrice;

    //on reoad everything need to be stored in local storage
    //1. Copy selected seats intoan array
    //2. Map through array
    //3. return a new array of indexes

    const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));  //[...something] is a spread operator, it copies/shows values of that variables. Here it converts nodelist into regular array
    // console.log(seatsIndex);

    //to store in localstorage
    localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));
}

//Save selected mobie index and price
function setMovieData(movieIndex, moviePrice) {
    localStorage.setItem('selectedMovieIndex', movieIndex);
    localStorage.setItem('selectedMoviePrice', moviePrice);
}

//Get data from localStorage and populate UI
function populateUI() {
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
    const occupiedSeats = JSON.parse(localStorage.getItem('occupiedSeats'));
    //console.log(selectedSeats);

    if(selectedSeats !== null && selectedSeats.length > 0) {
        seats.forEach((seat, index) => {
            if(selectedSeats.indexOf(index) > -1) {
                seat.classList.add('selected');
            }
        });
    }

    if(occupiedSeats !== null && occupiedSeats.length > 0) {
        seats.forEach((seat, index) => {
            if(occupiedSeats.indexOf(index) > -1) {
                seat.classList.add('occupied');
            }
        });
    }

    const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');

    if(selectedMovieIndex !== null) {
        movieSelect.selectedIndex = selectedMovieIndex; //as we are fetching from setMovieData() and here we are setting it
    }
}

//Seat click event
container.addEventListener('click', e => {
    if(e.target.classList.contains('seat') && 
    !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');

        updateSelectedCount();
    }
})

//Movie click event
movieSelect.addEventListener('change', e => {
    ticketPrice = e.target.value;

    updateSelectedCount();

    //To check which movie we selected and cost of that movie
    //console.log(e.target.selectedIndex, e.target.value);
    setMovieData(e.target.selectedIndex, e.target.value);
})

//On reload count of seats gets relaod and thats bcoz when the updateSelectedCount() is called, so the value inside this function doesnt get updated on reload so call at bottom.
//Initial count and total set
updateSelectedCount();

//Clearing all the seats selected
clear.addEventListener('click', (e) =>{

    Object.keys(localStorage).forEach(key => {
        if (key !== "occupiedSeats") {
            localStorage.removeItem(key)
        }
    });

    // localStorage.clear();
    seats.forEach(seat => {
        seat.classList.remove('selected');
    })
    count.innerText = 0;
    total.innerText = 0;
});

//Converting selected seats to occupied
payment.addEventListener('click', e => {
    
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));

    if(selectedSeats !== null && selectedSeats.length > 0) {
        seats.forEach((seat, index) => {
            if(selectedSeats.indexOf(index) > -1) {
                seat.classList.add('occupied');
            }
        });
        const occupiedSeats = document.querySelectorAll('.row .seat.occupied');
        const seatsIndex = [...occupiedSeats].map(seat => [...seats].indexOf(seat));  
        localStorage.setItem('occupiedSeats', JSON.stringify(seatsIndex));
    
    }

    alert(`Payment Done! $${total.innerText}`)
    Object.keys(localStorage).forEach(key => {
        if (key !== "occupiedSeats") {
            localStorage.removeItem(key)
        }
    });
    count.innerText = 0;
    total.innerText = 0;
})