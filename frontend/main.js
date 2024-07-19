$(document).ready(function() {
    const apiBaseUrl = 'http://localhost:5000/api/notes';

    // Load Notes
    function loadNotes(view) {
        $.get(apiBaseUrl, function(notes) {
            $('#noteList').empty();
            notes = notes.filter(note => {
                // Handle special views
                if (view === 'archived') return note.archived;
                if (view === 'trash') return note.trashed && new Date(note.trashedDate) >= new Date(Date.now() - 30*24*60*60*1000); // last 30 days
                return true;
            });
            notes.forEach(note => {
                addNoteToUI(note);
            });
        });
    }

    // Add Note to UI
    function addNoteToUI(note) {
        $('#noteList').append(`
            <div class="note" style="background-color: ${note.backgroundColor}">
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <small>Tags: ${note.tags.join(', ')}</small>
                ${note.reminder ? `<small>Reminder: ${new Date(note.reminder).toLocaleString()}</small>` : ''}
                ${note.archived ? '<small>Archived</small>' : ''}
                <button class="delete-btn" data-id="${note._id}">Delete</button>
            </div>
        `);
    }

    // Create Note
    $('#noteForm').on('submit', function(e) {
        e.preventDefault();
        const title = $('#title').val();
        const content = $('#content').val();
        const tags = $('#tags').val().split(',').map(tag => tag.trim());
        const backgroundColor = $('#backgroundColor').val();
        const reminder = $('#reminder').val();

        $.post(apiBaseUrl, { title, content, tags, backgroundColor, reminder })
            .done(function(note) {
                addNoteToUI(note);
                $('#noteForm')[0].reset();
            })
            .fail(function() {
                alert('Failed to create note');
            });
    });

    // Search Notes
    $('#searchInput').on('input', function() {
        const query = $(this).val().toLowerCase();
        $('#noteList .note').each(function() {
            const title = $(this).find('h3').text().toLowerCase();
            const content = $(this).find('p').text().toLowerCase();
            const tags = $(this).find('small').text().toLowerCase();
            $(this).toggle(title.includes(query) || content.includes(query) || tags.includes(query));
        });
    });

    // Handle View Buttons
    $('#showAll').click(() => loadNotes());
    $('#showArchived').click(() => loadNotes('archived'));
    $('#showTrash').click(() => loadNotes('trash'));

    // Handle Delete Button
    $('#noteList').on('click', '.delete-btn', function() {
        const noteId = $(this).data('id');
        $.ajax({
            url: `${apiBaseUrl}/${noteId}`,
            type: 'DELETE',
            success: function() {
                loadNotes();
            },
            error: function() {
                alert('Failed to delete note');
            }
        });
    });

    // Initial Load
    loadNotes();
});
