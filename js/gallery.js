// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');
    const loading = document.getElementById('loading');
    const emptyState = document.getElementById('emptyState');
    const loginLink = document.getElementById('loginLink');
    const logoutBtn = document.getElementById('logoutBtn');

    // Check authentication state
    firebaseAuth.onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            loginLink.style.display = 'none';
            logoutBtn.style.display = 'block';
        } else {
            // User is signed out
            loginLink.style.display = 'block';
            logoutBtn.style.display = 'none';
        }
    });

    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        firebaseAuth.signOut().then(() => {
            console.log('User signed out');
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    });

    // Load photos from Firestore
    loadPhotos();

    function loadPhotos() {
        // Show loading state
        loading.style.display = 'block';
        gallery.style.display = 'none';
        emptyState.style.display = 'none';

        // Query Firestore for photos, ordered by upload date
        firebaseDb.collection('photos')
            .orderBy('uploadDate', 'desc')
            .get()
            .then((querySnapshot) => {
                loading.style.display = 'none';
                
                if (querySnapshot.empty) {
                    // No photos found
                    emptyState.style.display = 'block';
                    return;
                }

                // Display photos
                gallery.style.display = 'grid';
                gallery.innerHTML = '';

                querySnapshot.forEach((doc) => {
                    const photoData = doc.data();
                    const photoCard = createPhotoCard(doc.id, photoData);
                    gallery.appendChild(photoCard);
                });
            })
            .catch((error) => {
                console.error('Error loading photos:', error);
                loading.style.display = 'none';
                emptyState.style.display = 'block';
                emptyState.innerHTML = `
                    <div class="empty-icon">⚠️</div>
                    <h3>Error loading photos</h3>
                    <p>Please try refreshing the page.</p>
                `;
            });
    }

    function createPhotoCard(photoId, photoData) {
        const card = document.createElement('div');
        card.className = 'photo-card';
        
        // Format date
        const uploadDate = photoData.uploadDate ? photoData.uploadDate.toDate() : new Date();
        const formattedDate = uploadDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Create player tags HTML
        let playerTagsHTML = '';
        if (photoData.players && photoData.players.length > 0) {
            playerTagsHTML = `
                <div class="photo-players">
                    ${photoData.players.map(player => `<span class="player-tag">${player}</span>`).join('')}
                </div>
            `;
        }

        card.innerHTML = `
            <img src="${photoData.imageUrl}" alt="Photo from Cooperstown Dreams Park" class="photo-image">
            <div class="photo-info">
                <div class="photo-date">${formattedDate}</div>
                ${playerTagsHTML}
            </div>
        `;

        // Add click handler to open full-size image
        card.addEventListener('click', function() {
            window.open(photoData.imageUrl, '_blank');
        });

        return card;
    }
});
