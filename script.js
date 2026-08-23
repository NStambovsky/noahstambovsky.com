document.getElementById("copy-ai-md")?.addEventListener("click", async () => {
  const textarea = document.getElementById("ai-md");
  const status = document.getElementById("copy-ai-md-status");
  const text = textarea?.value.trim() || "";
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    if (status) status.textContent = "Copied.";
    setTimeout(() => {
      if (status) status.textContent = "";
    }, 1800);
  } catch {
    textarea.focus();
    textarea.select();
    if (status) status.textContent = "Select all + copy.";
  }
});
