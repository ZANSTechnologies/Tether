// Dashboard page wiring: session check, list toggle, search form, logout,
// initial contact load, and the delete confirmation modal.

var pendingDelete = null; // contact object awaiting delete confirmation

document.addEventListener("DOMContentLoaded", function()
{
    readCookie();

    // Restore the list toggle state from localStorage so the preference
    // persists across page loads. Defaults to visible.
    const saved = localStorage.getItem("contactListVisible");
    const toggle = document.getElementById("contactListToggle");
    const visible = saved === null ? true : saved === "true";
    toggle.checked = visible;
    document.getElementById("contactListWrapper").style.display = visible ? "" : "none";

    toggle.addEventListener("change", function()
    {
        document.getElementById("contactListWrapper").style.display = this.checked ? "" : "none";
        localStorage.setItem("contactListVisible", this.checked);
    });

    document.getElementById("logoutButton").addEventListener("click", doLogout);

    // Search submits via button click OR Enter key.
    document.getElementById("searchForm").addEventListener("submit", function(event)
    {
        event.preventDefault();
        searchContact();
    });

    // Delete confirmation modal wiring.
    const modal = document.getElementById("deleteModal");

    document.getElementById("deleteModalCancel").addEventListener("click", closeDeleteModal);

    document.getElementById("deleteModalConfirm").addEventListener("click", function()
    {
        if (pendingDelete)
        {
            deleteContact(pendingDelete.ID, userId);
        }
        closeDeleteModal();
    });

    // Click on the dimmed backdrop closes the modal.
    modal.addEventListener("click", function(event)
    {
        if (event.target === modal)
        {
            closeDeleteModal();
        }
    });

    // Escape key closes the modal.
    document.addEventListener("keydown", function(event)
    {
        if (event.key === "Escape" && !modal.hidden)
        {
            closeDeleteModal();
        }
    });

    // Load ALL contacts on arrival — an empty search matches everything,
    // so the list and graph aren't blank until the first manual search.
    searchContact();
});

// Opens the confirmation modal for a contact. Called from the per-row
// Delete buttons built in searchContact.js.
function showDeleteModal(contact)
{
    pendingDelete = contact;
    document.getElementById("deleteModalText").textContent =
        "Are you sure you want to delete " + contact.FirstName + " " + contact.LastName + "? This can't be undone.";
    document.getElementById("deleteModal").hidden = false;
    document.getElementById("deleteModalCancel").focus();
}

function closeDeleteModal()
{
    pendingDelete = null;
    document.getElementById("deleteModal").hidden = true;
}
