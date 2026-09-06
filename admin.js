"use strict";

const ORDERS_KEY = "jasa_kampung_orders";
const ADMIN_LOGIN_KEY = "jasa_kampung_admin_login";

document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // CEK LOGIN ADMIN
    // ==============================

    if (
        localStorage.getItem(ADMIN_LOGIN_KEY) !== "true"
    ) {
        window.location.replace("admin-login.html");
        return;
    }

    // ==============================
    // LOGOUT
    // ==============================

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            const yakin = confirm(
                "Apakah kamu yakin ingin logout?"
            );

            if (!yakin) return;

            localStorage.removeItem(
                ADMIN_LOGIN_KEY
            );

            window.location.replace(
                "admin-login.html"
            );
        });
    }

    // ==============================
    // TAMPILKAN PESANAN
    // ==============================

    renderAdminOrders();

});


// ======================================
// AMBIL PESANAN
// ======================================

function getOrders() {

    try {

        return JSON.parse(
            localStorage.getItem(ORDERS_KEY)
        ) || [];

    } catch (error) {

        console.error(
            "Gagal membaca pesanan:",
            error
        );

        return [];
    }
}


// ======================================
// SIMPAN PESANAN
// ======================================

function saveOrders(orders) {

    localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(orders)
    );
}


// ======================================
// RENDER DASHBOARD
// ======================================

function renderAdminOrders() {

    const orders = getOrders();

    const list =
        document.getElementById("ordersList");

    const totalOrders =
        document.getElementById("totalOrders");

    const waitingOrders =
        document.getElementById("waitingOrders");

    const doneOrders =
        document.getElementById("doneOrders");


    // Jika elemen tidak ditemukan
    if (!list) return;


    // ==================================
    // STATISTIK
    // ==================================

    if (totalOrders) {

        totalOrders.textContent =
            orders.length;
    }

    if (waitingOrders) {

        waitingOrders.textContent =
            orders.filter(order =>
                getStatus(order) === "Menunggu"
            ).length;
    }

    if (doneOrders) {

        doneOrders.textContent =
            orders.filter(order =>
                getStatus(order) === "Selesai"
            ).length;
    }


    // ==================================
    // BELUM ADA PESANAN
    // ==================================

    if (!orders.length) {

        list.innerHTML = `
            <div class="empty">

                <h3>📭 Belum ada pesanan</h3>

                <p>
                    Pesanan pelanggan akan
                    muncul di sini.
                </p>

            </div>
        `;

        return;
    }


    // ==================================
    // TAMPILKAN PESANAN TERBARU DI ATAS
    // ==================================

    list.innerHTML = orders
        .slice()
        .reverse()
        .map(createOrderCard)
        .join("");
}


// ======================================
// STATUS PESANAN
// ======================================

function getStatus(order) {

    return order.status || "Menunggu";
}


// ======================================
// BUAT CARD PESANAN
// ======================================

function createOrderCard(order) {

    const status =
        getStatus(order);


    const statusClass =
        status
            .toLowerCase()
            .replace(/\s+/g, "");


    return `
        <article class="order-card">

            <div class="order-top">

                <div class="order-code">
                    ${escapeHTML(
                        order.code ||
                        "Tanpa kode"
                    )}
                </div>

                <span
                    class="status ${statusClass}">
                    ${getStatusIcon(status)}
                    ${escapeHTML(status)}
                </span>

            </div>


            <div class="order-info">

                <div>
                    <b>Jasa:</b>
                    ${escapeHTML(
                        order.serviceName ||
                        order.service ||
                        "-"
                    )}
                </div>


                <div>
                    <b>Nama:</b>
                    ${escapeHTML(
                        order.customerName ||
                        order.name ||
                        "-"
                    )}
                </div>


                <div>
                    <b>Telepon:</b>
                    ${escapeHTML(
                        order.phone ||
                        "-"
                    )}
                </div>


                <div>
                    <b>Alamat:</b>
                    ${escapeHTML(
                        order.address ||
                        "-"
                    )}
                </div>


                <div>
                    <b>Jadwal:</b>
                    ${escapeHTML(
                        order.schedule ||
                        order.date ||
                        "-"
                    )}
                </div>


                <div>
                    <b>Total:</b>
                    ${formatRupiah(
                        order.total || 0
                    )}
                </div>

            </div>


            <div class="actions">

                ${
                    status === "Menunggu"
                    ?
                    `
                    <button
                        type="button"
                        class="btn-process"
                        onclick="changeStatus(
                            '${escapeAttribute(order.id)}',
                            'Diproses'
                        )">

                        🔵 Terima / Diproses

                    </button>
                    `
                    :
                    ""
                }


                ${
                    status === "Diproses"
                    ?
                    `
                    <button
                        type="button"
                        class="btn-done"
                        onclick="changeStatus(
                            '${escapeAttribute(order.id)}',
                            'Selesai'
                        )">

                        🟢 Tandai Selesai

                    </button>
                    `
                    :
                    ""
                }


                ${
                    status !== "Selesai" &&
                    status !== "Dibatalkan"
                    ?
                    `
                    <button
                        type="button"
                        class="btn-cancel"
                        onclick="changeStatus(
                            '${escapeAttribute(order.id)}',
                            'Dibatalkan'
                        )">

                        🔴 Batalkan

                    </button>
                    `
                    :
                    ""
                }

            </div>

        </article>
    `;
}


// ======================================
// ICON STATUS
// ======================================

function getStatusIcon(status) {

    switch (status) {

        case "Menunggu":
            return "🟡";

        case "Diproses":
            return "🔵";

        case "Selesai":
            return "🟢";

        case "Dibatalkan":
            return "🔴";

        default:
            return "⚪";
    }
}


// ======================================
// UBAH STATUS
// ======================================

function changeStatus(orderId, newStatus) {

    const orders = getOrders();


    const index = orders.findIndex(
        order =>
            String(order.id) ===
            String(orderId)
    );


    if (index === -1) {

        alert(
            "Pesanan tidak ditemukan."
        );

        return;
    }


    // ==================================
    // KONFIRMASI
    // ==================================

    const yakin = confirm(
        `Ubah status pesanan menjadi "${newStatus}"?`
    );


    if (!yakin) return;


    // ==================================
    // UPDATE STATUS
    // ==================================

    orders[index].status =
        newStatus;


    orders[index].updatedAt =
        new Date().toISOString();


    saveOrders(orders);


    // ==================================
    // REFRESH DASHBOARD
    // ==================================

    renderAdminOrders();
}


// ======================================
// FORMAT RUPIAH
// ======================================

function formatRupiah(value) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(
        Number(value) || 0
    );
}


// ======================================
// ESCAPE HTML
// ======================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ======================================
// ESCAPE ATTRIBUTE
// ======================================

function escapeAttribute(value) {

    return String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}


// ======================================
// PUBLIC API
// ======================================

window.changeStatus =
    changeStatus;