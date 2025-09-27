// Modal Sidenotes JavaScript
document.addEventListener('DOMContentLoaded', function() {
    let openModals = [];

    // Create a new modal
    function createModal(content, number, mouseX, mouseY) {
        const modalContainer = document.createElement('div');
        modalContainer.className = 'sidenote-modal';
        modalContainer.innerHTML = `
            <div class="sidenote-content">
                <button class="sidenote-close">&times;</button>
                <p><strong>${number}.</strong> ${content}</p>
            </div>
        `;
        document.body.appendChild(modalContainer);

        const modalContent = modalContainer.querySelector('.sidenote-content');
        const closeBtn = modalContainer.querySelector('.sidenote-close');

        // Position modal at cursor with slight offset for multiple modals
        const offset = openModals.length * 30;
        let x = mouseX + offset;
        let y = mouseY + offset;

        // Ensure modal doesn't go off screen
        const modalWidth = 450;
        const modalHeight = 200; // estimated height

        if (x + modalWidth > window.innerWidth) {
            x = window.innerWidth - modalWidth - 20;
        }
        if (y + modalHeight > window.innerHeight) {
            y = window.innerHeight - modalHeight - 20;
        }
        if (x < 0) x = 20;
        if (y < 0) y = 20;

        modalContent.style.left = x + 'px';
        modalContent.style.top = y + 'px';


        // Close modal on X button click
        closeBtn.addEventListener('click', () => closeModal(modalContainer));

        // Make modal draggable
        makeDraggable(modalContent);

        openModals.push(modalContainer);
        return modalContainer;
    }


    // Make element draggable
    function makeDraggable(element) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        element.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target.classList.contains('sidenote-close')) return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            // Get current position
            const rect = element.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            // Clear any existing transform and set absolute positioning
            element.style.transform = 'none';
            element.style.left = startLeft + 'px';
            element.style.top = startTop + 'px';

            e.preventDefault();
        }

        function drag(e) {
            if (!isDragging) return;

            e.preventDefault();

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            element.style.left = (startLeft + deltaX) + 'px';
            element.style.top = (startTop + deltaY) + 'px';
        }

        function dragEnd() {
            isDragging = false;
        }
    }

    // Show modal
    function showModal(content, refElement, mouseX, mouseY) {
        // Check if this reference already has an open modal
        if (refElement.dataset.modalOpen === 'true') {
            return;
        }

        // Get the sidenote number by finding position in document
        const allRefs = document.querySelectorAll('.sidenote-ref');
        const number = Array.from(allRefs).indexOf(refElement) + 1;

        const modal = createModal(content, number, mouseX, mouseY);
        modal.classList.add('show');

        // Mark this reference as having an open modal
        refElement.dataset.modalOpen = 'true';
        modal.dataset.refContent = content;

        return modal;
    }

    // Close modal
    function closeModal(modalContainer) {
        // Mark the reference as available again
        const content = modalContainer.dataset.refContent;
        if (content) {
            const actualRef = document.querySelector(`[data-content="${content}"]`);
            if (actualRef) {
                actualRef.dataset.modalOpen = 'false';
            }
        }

        // Remove from openModals array
        const index = openModals.indexOf(modalContainer);
        if (index > -1) {
            openModals.splice(index, 1);
        }

        // Remove modal immediately
        if (modalContainer.parentNode) {
            modalContainer.parentNode.removeChild(modalContainer);
        }
    }


    // Initialize sidenotes
    function initSidenotes() {
        const sidenoteRefs = document.querySelectorAll('.sidenote-ref');

        sidenoteRefs.forEach(ref => {
            const content = ref.getAttribute('data-content');

            if (!content) return;

            // Click handler for modal
            ref.addEventListener('click', function(e) {
                e.preventDefault();
                this.blur(); // Remove focus highlight
                showModal(content, this, e.clientX, e.clientY);
            });

        });
    }

    // ESC key handler to close most recent modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && openModals.length > 0) {
            const lastModal = openModals[openModals.length - 1];
            closeModal(lastModal);
        }
    });

    // Initialize when DOM is ready
    initSidenotes();

    // Re-initialize if content is dynamically added
    window.reinitSidenotes = initSidenotes;
});