// ============================
// RESET PASSWORD
// ============================

document.addEventListener("DOMContentLoaded", async () => {

    const { data } =
    await supabaseClient.auth.getSession();

    console.log("SESSION RESET:", data.session);

});