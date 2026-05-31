# Run this once the new acidity kit images appear in the brain directory
# Images sent at ~2026-05-24T13:31 UTC

$brain = "C:\Users\RAJ SHAH\.gemini\antigravity\brain\5a91813d-2836-44b0-9f17-a8b0284369cb"
$assets = "C:\Users\RAJ SHAH\.gemini\antigravity\scratch\truheat-website\assets"

# Get the two newest images (sent in this session, after May 24 13:30 UTC)
$newImages = Get-ChildItem $brain | 
  Where-Object { $_.Extension -match '\.(jpg|png)' -and $_.LastWriteTime -gt (Get-Date "2026-05-24T13:30:00Z") } |
  Sort-Object LastWriteTime

if ($newImages.Count -ge 2) {
    # Second image = product photo (user said use 2nd image for the page)
    $productPhoto = $newImages[1]
    $ext = $productPhoto.Extension
    Copy-Item $productPhoto.FullName "$assets\acidity-photo-1$ext" -Force
    Write-Host "Copied product photo: $($productPhoto.Name) -> acidity-photo-1$ext"
} elseif ($newImages.Count -eq 1) {
    $ext = $newImages[0].Extension
    Copy-Item $newImages[0].FullName "$assets\acidity-photo-1$ext" -Force
    Write-Host "Copied: $($newImages[0].Name) -> acidity-photo-1$ext"
} else {
    Write-Host "Images not yet saved to disk. Try again in a moment."
}
