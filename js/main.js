import fetchJsonp from 'fetch-jsonp';
import {
    isValidZip,
    showAlert
} from './validate';

const petForm = document.querySelector('#pet-form');
petForm.addEventListener('submit', fetchAnimals);

/* FETCH ANIMALS */
function fetchAnimals(e) {
    e.preventDefault();

    const animal = document.getElementById('animal').value;
    const zip = document.getElementById('zip-form').value;

    if (!isValidZip(zip)) {
        showAlert('Please Enter A Valid ZipCode. Only USA zipcodes are allowed.', 'alert-danger');
        return;
    }

    fetchJsonp(`https://api.petfinder.com/pet.find?format=json&key=34c31b30f45361944a27965cf471c6a0&animal=${animal}&location=${zip}&callback=callback`, {
            jsonpCallbackFunction: 'callback'
        })
        .then(res => res.json())
        .then(data => showAnimals(data.petfinder.pets.pet))
        .catch(err => console.log(err));
}

function showAnimals(pets) {
    const results = document.getElementById('results');
    results.innerHTML = '';

    pets.forEach(pet => {
        const div = document.createElement('div');
        div.classList.add('card', 'card-body', 'mb-3');
        div.innerHTML = `
            <div class="row">
                <div class="col-sm-6">
                    <h4>${pet.name.$t} (${pet.age.$t})</h4>
                    <p class="text-secondary">${pet.breeds.breed.$t ? pet.breeds.breed.$t : ''}</p>
                    <p>${pet.contact.address1.$t ? pet.contact.address1.$t : ''} ${pet.contact.city.$t ? pet.contact.city.$t : ''} ${pet.contact.state.$t ? pet.contact.state.$t : ''} ${pet.contact.zip.$t ? pet.contact.zip.$t : ''}</p>
                    <ul class="list-group">
                        <li class="list-group-item">Phone: ${pet.contact.phone.$t}</li>
                        ${pet.contact.email.$t ? `<li class="list-group-item">Email: ${pet.contact.email.$t}</li>` : ``}
                        <li class="list-group-item">Shelter Id: ${pet.shelterId.$t}</li>
                    </ul>
                </div>
                <div class="col-sm-6 text-center">
                    ${pet.media.photos ? `<img class="img-fluid rounded-circle mt-2" src="${pet.media.photos.photo[3].$t.replace('http', 'https')}">` : ''}
                </div> 
            </div>
        `;

        results.appendChild(div);
    });
}