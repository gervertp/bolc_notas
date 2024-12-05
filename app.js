// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAQ6F4V8_ZTEuGBJq4w145JfbFr674LJnY",
    authDomain: "bloc-de-nota.firebaseapp.com",
    databaseURL: "https://bloc-de-nota-default-rtdb.firebaseio.com",
    projectId: "bloc-de-nota",
    storageBucket: "bloc-de-nota.appspot.com",
    messagingSenderId: "1045863299378",
    appId: "1:1045863299378:web:58627d6764ed5b130cbf2b",
    measurementId: "G-J89DMG4Z2N"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Variables DOM
const noteTitle = document.getElementById('noteTitle');
const noteInput = document.getElementById('noteInput');
const saveNote = document.getElementById('saveNote');
const noteList = document.getElementById('noteList');

// Guardar Nota en Firebase
function saveNoteToFirebase(title, content) {
    const noteId = Date.now();
    const noteRef = database.ref('notes/' + noteId);
    noteRef.set({
        title: title,
        content: content
    });
}

// Cargar Notas desde Firebase
function loadNotesFromFirebase() {
    const notesRef = database.ref('notes/');
    notesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        noteList.innerHTML = '';
        for (const id in data) {
            const note = data[id];
            createNoteElement(id, note.title, note.content);
        }
    });
}

// Crear Nota en el DOM
function createNoteElement(id, title, content) {
    const listItem = document.createElement('div');
    listItem.className = 'card shadow-sm col-md-4';
    listItem.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-content">${content}</p>
            <div class="d-flex justify-content-between mt-2">
                <button class="btn btn-warning btn-sm edit-button">Editar</button>
                <button class="btn btn-danger btn-sm delete-button">Eliminar</button>
            </div>
        </div>
    `;

    listItem.querySelector('.delete-button').addEventListener('click', () => {
        deleteNoteFromFirebase(id);
        listItem.remove();
    });

    noteList.appendChild(listItem);
}

// Eliminar Nota desde Firebase
function deleteNoteFromFirebase(noteId) {
    const noteRef = database.ref('notes/' + noteId);
    noteRef.remove();
}

// Guardar Nota al Hacer Click
saveNote.addEventListener('click', () => {
    const title = noteTitle.value.trim();
    const content = noteInput.value.trim();
    if (title === '' || content === '') {
        alert('Por favor, completa el título y el contenido.');
        return;
    }
    saveNoteToFirebase(title, content);
    noteTitle.value = '';
    noteInput.value = '';
});

// Cargar Notas al Inicio
loadNotesFromFirebase();
