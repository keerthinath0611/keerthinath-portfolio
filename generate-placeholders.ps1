Add-Type -AssemblyName System.Drawing

function Draw-CenterText {
    param($g, [string]$text, $font, $brush, [float]$centerX, [float]$y)
    $size = $g.MeasureString($text, $font)
    $x = $centerX - ($size.Width / 2.0)
    $g.DrawString($text, $font, $brush, [float]$x, [float]$y)
    return $size.Height
}

function Create-Placeholder {
    param(
        [string]$Filename,
        [int]$W,
        [int]$H,
        [string]$BadgeText,
        [string]$Title,
        [string]$Subtitle,
        [string]$Highlight,
        [string]$AccentHex
    )

    $bmp = [System.Drawing.Bitmap]::new($W, $H)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    $accent = [System.Drawing.ColorTranslator]::FromHtml($AccentHex)
    $bgCol = [System.Drawing.Color]::FromArgb(11, 15, 25)       # Obsidian / deep slate
    $cardCol = [System.Drawing.Color]::FromArgb(19, 27, 46)     # Slate container
    $borderCol = [System.Drawing.Color]::FromArgb(45, 55, 78)   # Slate border
    $mutedCol = [System.Drawing.Color]::FromArgb(148, 163, 184)  # Slate 400
    $dimCol = [System.Drawing.Color]::FromArgb(100, 116, 139)    # Slate 500
    $whiteCol = [System.Drawing.Color]::FromArgb(248, 250, 252)

    # Fill base
    $bgBrush = [System.Drawing.SolidBrush]::new($bgCol)
    $g.FillRectangle($bgBrush, 0, 0, $W, $H)

    # Draw grid
    $gridPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(18, 255, 255, 255), 1)
    for ($x = 0; $x -lt $W; $x += 40) { $g.DrawLine($gridPen, $x, 0, $x, $H) }
    for ($y = 0; $y -lt $H; $y += 40) { $g.DrawLine($gridPen, 0, $y, $W, $y) }

    # Draw Card
    $margin = 32
    $cw = $W - (2 * $margin)
    $ch = $H - (2 * $margin)
    $cardBrush = [System.Drawing.SolidBrush]::new($cardCol)
    $g.FillRectangle($cardBrush, $margin, $margin, $cw, $ch)

    $borderPen = [System.Drawing.Pen]::new($borderCol, 2)
    $g.DrawRectangle($borderPen, $margin, $margin, $cw, $ch)

    # Accent Top Stripe
    $accentBrush = [System.Drawing.SolidBrush]::new($accent)
    $g.FillRectangle($accentBrush, $margin, $margin, $cw, 6)

    # Badge
    $fontBadge = [System.Drawing.Font]::new("Segoe UI", [float]11, [System.Drawing.FontStyle]::Bold)
    $badgeSize = $g.MeasureString($BadgeText, $fontBadge)
    $bx = ($W - $badgeSize.Width) / 2.0
    $by = [float]($margin + 30)

    $badgeBgBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(40, $accent.R, $accent.G, $accent.B))
    $badgeBorderPen = [System.Drawing.Pen]::new($accent, 1)
    $g.FillRectangle($badgeBgBrush, [float]($bx - 14), [float]($by - 6), [float]($badgeSize.Width + 28), [float]($badgeSize.Height + 12))
    $g.DrawRectangle($badgeBorderPen, [float]($bx - 14), [float]($by - 6), [float]($badgeSize.Width + 28), [float]($badgeSize.Height + 12))
    $g.DrawString($BadgeText, $fontBadge, $accentBrush, [float]$bx, [float]$by)

    # Title
    $fontTitle = [System.Drawing.Font]::new("Segoe UI", [float]22, [System.Drawing.FontStyle]::Bold)
    $whiteBrush = [System.Drawing.SolidBrush]::new($whiteCol)
    $currY = [float]($H / 2.0 - 55)
    $th = Draw-CenterText -g $g -text $Title -font $fontTitle -brush $whiteBrush -centerX ([float]($W / 2.0)) -y $currY
    $currY += $th + 8

    # Subtitle
    $fontSub = [System.Drawing.Font]::new("Segoe UI", [float]13, [System.Drawing.FontStyle]::Regular)
    $mutedBrush = [System.Drawing.SolidBrush]::new($mutedCol)
    $sh = Draw-CenterText -g $g -text $Subtitle -font $fontSub -brush $mutedBrush -centerX ([float]($W / 2.0)) -y $currY
    $currY += $sh + 10

    # Highlight / Detail
    if ($Highlight) {
        $fontHigh = [System.Drawing.Font]::new("Segoe UI", [float]12, [System.Drawing.FontStyle]::Bold)
        Draw-CenterText -g $g -text $Highlight -font $fontHigh -brush $accentBrush -centerX ([float]($W / 2.0)) -y $currY | Out-Null
    }

    # Footer note
    $fontFoot = [System.Drawing.Font]::new("Consolas", [float]10, [System.Drawing.FontStyle]::Regular)
    $footBrush = [System.Drawing.SolidBrush]::new($dimCol)
    $footText = "[ Image Slot: images/$Filename ]"
    Draw-CenterText -g $g -text $footText -font $fontFoot -brush $footBrush -centerX ([float]($W / 2.0)) -y ([float]($H - $margin - 32)) | Out-Null

    # Clean up and save
    $dest = "C:\Users\kvasa\.gemini\antigravity\scratch\keerthinath-portfolio\images\$Filename"
    $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created: $Filename"
}

Create-Placeholder -Filename "profile.jpg" -W 800 -H 800 -BadgeText "PROFILE PHOTO CONTAINER" -Title "KEERTHINATH V" -Subtitle "B.Tech CSE | VIT Vellore" -Highlight "Academic Research & Core Computer Science" -AccentHex "#10B981"
Create-Placeholder -Filename "project1.jpg" -W 1200 -H 750 -BadgeText "FEATURED PROJECT 01" -Title "Chess State Analyzer & Evaluator" -Subtitle "Minimax Heuristic Engine with Alpha-Beta Pruning" -Highlight "Stack: Python • C++ • React" -AccentHex "#10B981"
Create-Placeholder -Filename "project2.jpg" -W 1200 -H 750 -BadgeText "FEATURED PROJECT 02" -Title "Historical Data & Timeline Visualizer" -Subtitle "Interactive Chronological Engine & Demographic Modeling" -Highlight "Stack: React • Tailwind CSS • Chart.js" -AccentHex "#38BDF8"
Create-Placeholder -Filename "cert-10th.jpg" -W 1200 -H 800 -BadgeText "BOARD DISTINCTION" -Title "10th Board Examination — 97.6%" -Subtitle "School First Rank Honors" -Highlight "Centum / Near-Centum in Mathematics & Science" -AccentHex "#F59E0B"
Create-Placeholder -Filename "cert-11th.jpg" -W 1200 -H 800 -BadgeText "DISTRICT RANK 1" -Title "11th Standard Board — 98.83%" -Subtitle "District First Rank Distinction" -Highlight "Highest Academic Aggregate in District" -AccentHex "#F59E0B"
Create-Placeholder -Filename "cert-12th.jpg" -W 1200 -H 800 -BadgeText "BOARD DISTINCTION" -Title "12th Board Examination — 98.5%" -Subtitle "School First Rank Honors" -Highlight "Academic Excellence in Computer Science & Mathematics" -AccentHex "#F59E0B"
Create-Placeholder -Filename "cert-scholarship.jpg" -W 1200 -H 800 -BadgeText "MERIT SCHOLARSHIP" -Title "100% Merit Scholarship Award" -Subtitle "Higher Secondary Academic Excellence" -Highlight "Full 100% Academic Merit Scholarship Recognition" -AccentHex "#10B981"
Create-Placeholder -Filename "cert-outgoing.jpg" -W 1200 -H 800 -BadgeText "HIGHEST VALEDICTORIAN HONOR" -Title "Best Outgoing Student Award" -Subtitle "Overall Academic Excellence, Leadership & Conduct" -Highlight "Premier Institutional Valedictorian Distinction" -AccentHex "#F59E0B"

Write-Host "All placeholder JPEG files rendered successfully!"

