# PowerShell script to delete all files and directories except README files
# WARNING: This is a destructive operation!

# Get all items (files and directories) in the current directory
$items = Get-ChildItem -Path . -Force

foreach ($item in $items) {
    # Skip README files (case-insensitive)
    if ($item.Name -like "README*" -or $item.Name -like "readme*") {
        Write-Host "Keeping: $($item.Name)" -ForegroundColor Green
        continue
    }
    
    # Delete everything else
    Write-Host "Deleting: $($item.Name)" -ForegroundColor Red
    Remove-Item -Path $item.FullName -Recurse -Force
}

Write-Host "`nCleanup complete! Only README files remain." -ForegroundColor Yellow
