// Tab Switching Logic
        function switchTab(tabId) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
            // Remove active class from all tab buttons
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('border-b-2', 'border-[#f4f4f5]', 'text-[#f4f4f5]');
                btn.classList.add('text-[#a1a1aa]');
            });

            // Show selected tab content
            const selectedTab = document.getElementById(tabId + '-tab');
            selectedTab.classList.remove('hidden');

            // Activate selected tab button
            const selectedBtn = document.querySelector(`[data-tab="${tabId}"]`);
            selectedBtn.classList.remove('text-[#a1a1aa]');
            selectedBtn.classList.add('border-b-2', 'border-[#f4f4f5]', 'text-[#f4f4f5]');
        }

        // URL Scanner Logic
        document.getElementById("url-form").onsubmit = async function (e) {
            e.preventDefault();
            let url = document.getElementById("url-input").value;
            
            // Remove http:// or https:// from the URL
            url = url.replace(/^(https?:\/\/)/, '');
            
            const resultContainer = document.getElementById("url-result-container");
            const resultElement = document.getElementById("url-result");
            const detailsElement = document.getElementById("url-details");

            resultContainer.classList.remove('hidden');
            resultElement.className = "text-base font-semibold";
            resultContainer.className = "mt-4 p-4 rounded-xl border flex flex-col";
            document.getElementById("url-result-icon").innerHTML = "";

            try {
                const res = await fetch("http://127.0.0.1:8000/predict/url", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url })
                });
                const data = await res.json();

                if (data.phishing) {
                    resultElement.textContent = "Potential Phishing URL Detected";
                    resultContainer.querySelector('.alert').classList.add('alert-error');
                    document.getElementById("url-result-icon").innerHTML = `<svg class="h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
                    detailsElement.textContent = "This URL shows characteristics commonly associated with phishing attempts.";
                } else {
                    resultElement.textContent = "URL Verified Safe";
                    resultContainer.querySelector('.alert').classList.add('alert-success');
                    document.getElementById("url-result-icon").innerHTML = `<svg class="h-4 w-4 text-emerald-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
                    detailsElement.textContent = "This URL appears to be safe based on our analysis.";
                }
            } catch (error) {
                resultElement.textContent = "❌ Error scanning URL";
                resultElement.className += " text-red-600";
                resultContainer.className += " bg-red-50";
                detailsElement.textContent = "There was an error processing your request. Please try again.";
            }
        };

        // Email/SMS Scanner Logic
        document.getElementById("email-sms-form").onsubmit = async function (e) {
            e.preventDefault();
            const message = document.getElementById("message-input").value;
            const resultContainer = document.getElementById("email-result-container");
            const resultElement = document.getElementById("email-sms-result");
            const detailsElement = document.getElementById("email-details");

            resultContainer.classList.remove('hidden');
            resultElement.className = "text-base font-semibold";
            resultContainer.className = "mt-4 p-4 rounded-xl border flex flex-col";
            document.getElementById("email-result-icon").innerHTML = "";

            try {
                const res = await fetch("http://127.0.0.1:8000/predict/email_sms", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message })
                });
                const data = await res.json();

                if (data.phishing) {
                    resultElement.textContent = "Potential Phishing Message Detected";
                    resultContainer.querySelector('.alert').classList.add('alert-error');
                    document.getElementById("email-result-icon").innerHTML = `<svg class="h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
                    detailsElement.textContent = "This message contains patterns commonly found in phishing attempts.";
                } else {
                    resultElement.textContent = "Message Verified Safe";
                    resultContainer.querySelector('.alert').classList.add('alert-success');
                    document.getElementById("email-result-icon").innerHTML = `<svg class="h-4 w-4 text-emerald-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
                    detailsElement.textContent = "This message appears to be legitimate based on our analysis.";
                }
            } catch (error) {
                resultElement.textContent = "❌ Error scanning message";
                resultElement.className += " text-red-600";
                resultContainer.className += " bg-red-50";
                detailsElement.textContent = "There was an error processing your request. Please try again.";
            }
        };

        // File Scanner Logic
        document.getElementById("file-form").onsubmit = async function (e) {
            e.preventDefault();
            const file = document.getElementById("file-input").files[0];
            const resultContainer = document.getElementById("file-result-container");
            const resultElement = document.getElementById("file-result");
            const detailsElement = document.getElementById("file-details");

            if (file) {
                resultContainer.classList.remove('hidden');
                resultElement.className = "text-base font-semibold";
                resultContainer.className = "mt-4 p-4 rounded-xl border flex flex-col";
                document.getElementById("file-result-icon").innerHTML = "";

                try {
                    const file_size = file.size;
                    const file_type = getFileType(file.type);
                    const reader = new FileReader();

                    reader.onload = async function (event) {
                        const file_content = event.target.result;
                        const entropy = calculateEntropy(file_content);
                        const strings_count = countStrings(file_content);
                        const suspicious_strings = detectSuspiciousStrings(file_content);

                        const data = {
                            file_size,
                            file_type,
                            entropy,
                            strings_count,
                            suspicious_strings
                        };

                        const res = await fetch("http://127.0.0.1:8000/predict/file", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(data)
                        });
                        const result = await res.json();

                        if (result.malicious) {
                            resultElement.textContent = "Potential Malware Detected";
                            resultContainer.querySelector('.alert').classList.add('alert-error');
                            document.getElementById("file-result-icon").innerHTML = `<svg class="h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
                            detailsElement.textContent = "This file shows characteristics commonly associated with malware.";
                        } else {
                            resultElement.textContent = "File Verified Safe";
                            resultContainer.querySelector('.alert').classList.add('alert-success');
                            document.getElementById("file-result-icon").innerHTML = `<svg class="h-4 w-4 text-emerald-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
                            detailsElement.textContent = "This file appears to be safe based on our analysis.";
                        }
                    };

                    reader.readAsBinaryString(file);
                } catch (error) {
                    resultElement.textContent = "❌ Error scanning file";
                    resultElement.className += " text-red-600";
                    resultContainer.className += " bg-red-50";
                    detailsElement.textContent = "There was an error processing your request. Please try again.";
                }
            }
        };

        // QR Code Scanner Logic
        let html5QrCode;
        const qrReaderElem = document.getElementById("qr-reader");
        const startQrBtn = document.getElementById("start-qr-btn");
        const stopQrBtn = document.getElementById("stop-qr-btn");
        const qrResultContainer = document.getElementById("qr-result-container");
        const qrResultElem = document.getElementById("qr-result");
        const qrDetailsElem = document.getElementById("qr-details");

        startQrBtn.onclick = async function () {
            qrResultContainer.classList.add('hidden');
            startQrBtn.classList.add("hidden");
            stopQrBtn.classList.remove("hidden");

            html5QrCode = new Html5Qrcode("qr-reader");
            html5QrCode.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 250 },
                async (decodedText) => {
                    await processQRCode(decodedText);
                    await html5QrCode.stop();
                    startQrBtn.classList.remove("hidden");
                    stopQrBtn.classList.add("hidden");
                },
                (errorMessage) => {
                    // Handle scan errors
                }
            );
        };

        stopQrBtn.onclick = async function () {
            if (html5QrCode) {
                await html5QrCode.stop();
                startQrBtn.classList.remove("hidden");
                stopQrBtn.classList.add("hidden");
            }
        };

        // QR Code File Upload
        document.getElementById("qr-file-input").onchange = async function (e) {
            const file = e.target.files[0];
            if (file) {
                try {
                    const html5QrCode = new Html5Qrcode("qr-reader");
                    const decodedText = await html5QrCode.scanFile(file, true);
                    await processQRCode(decodedText);
                } catch (error) {
                    qrResultContainer.classList.remove('hidden');
                    qrResultElem.textContent = "❌ Error reading QR code";
                    qrResultElem.className = "text-sm font-medium text-red-600";
                    qrResultContainer.className = "mt-4 p-4 rounded-md bg-red-50";
                    qrDetailsElem.textContent = "Could not read the QR code from the image. Please try another image.";
                }
            }
        };

        async function processQRCode(decodedText) {
            // Remove http:// or https:// from the decoded URL
            decodedText = decodedText.replace(/^(https?:\/\/)/, '');
            
            qrResultContainer.classList.remove('hidden');
            qrResultElem.className = "text-base font-semibold";
            qrResultContainer.className = "mt-4 p-4 rounded-xl border flex flex-col";
            document.getElementById("qr-result-icon").innerHTML = "";

            try {
                const res = await fetch("http://127.0.0.1:8000/predict/url", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url: decodedText })
                });
                const data = await res.json();

                if (data.phishing) {
                    qrResultElem.textContent = "QR Code Contains Suspicious URL";
                    qrResultContainer.querySelector('.alert').classList.add('alert-error');
                    document.getElementById("qr-result-icon").innerHTML = `<svg class="h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
                    qrDetailsElem.textContent = "This URL shows characteristics commonly associated with phishing attempts.";
                } else {
                    qrResultElem.textContent = "QR Code URL Verified Safe";
                    qrResultContainer.querySelector('.alert').classList.add('alert-success');
                    document.getElementById("qr-result-icon").innerHTML = `<svg class="h-4 w-4 text-emerald-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
                    qrDetailsElem.textContent = "This URL appears to be safe based on our analysis.";
                }
            } catch (error) {
                qrResultElem.textContent = "❌ Error checking QR code URL";
                qrResultElem.className += " text-red-600";
                qrResultContainer.className += " bg-red-50";
                qrDetailsElem.textContent = "There was an error processing the URL from the QR code.";
            }
        }

        // Helper functions remain the same
        function getFileType(mimeType) {
            switch (mimeType) {
                case "application/pdf":
                    return 0;
                case "application/x-msdownload":
                    return 1;
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    return 2;
                case "text/plain":
                    return 3;
                case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    return 4;
                default:
                    return -1;
            }
        }

        function calculateEntropy(content) {
            let entropy = 0;
            const byteCount = new Array(256).fill(0);
            for (let i = 0; i < content.length; i++) {
                byteCount[content.charCodeAt(i)]++;
            }
            for (let i = 0; i < 256; i++) {
                if (byteCount[i] > 0) {
                    const p = byteCount[i] / content.length;
                    entropy -= p * Math.log2(p);
                }
            }
            return entropy;
        }

        function countStrings(content) {
            return (content.match(/[a-zA-Z]+/g) || []).length;
        }

        function detectSuspiciousStrings(content) {
            const suspiciousPatterns = ["malware", "virus", "trojan", "hack"];
            let count = 0;
            suspiciousPatterns.forEach(pattern => {
                if (content.includes(pattern)) {
                    count++;
                }
            });
            return count;
        }


        // Add this at the beginning of your script.js file

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOpenIcon = mobileMenuButton.querySelector('.menu-open');
    const menuCloseIcon = mobileMenuButton.querySelector('.menu-close');

    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        menuOpenIcon.classList.toggle('hidden');
        menuCloseIcon.classList.toggle('hidden');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
            mobileMenu.classList.add('hidden');
            menuOpenIcon.classList.remove('hidden');
            menuCloseIcon.classList.add('hidden');
        }
    });

    // Close mobile menu when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) { // md breakpoint
            mobileMenu.classList.add('hidden');
            menuOpenIcon.classList.remove('hidden');
            menuCloseIcon.classList.add('hidden');
        }
    });
});