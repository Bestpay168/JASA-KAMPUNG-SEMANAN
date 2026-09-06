"use strict";

const ORDERS_KEY = "jasa_kampung_orders";

document.addEventListener("DOMContentLoaded", () => {
    renderAdminOrders();
});

function getOrders() {
    try {
        return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    } catch (error) {
        console.error("Gagal membaca pesanan:", error);
        return [];
    }
}

function saveOrders(orders) {
    localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(orders)
    );
}

function renderAdminOrders() {

    const orders = getOrders();

    const list = document.getElementById("ordersList");

    document.getElementById("totalOrders").textContent =
        orders.length;

    document.getElementById("waitingOrders").textContent =
        orders.filter(order =>
            getStatus(order) === "Menunggu"
        ).length;

    document.getElementById("doneOrders").textContent =
        orders.filter(order =>
            getStatus(order) === "Selesai"
        ).length;

    if (!orders.length) {

        list.innerHTML = `
            <div class="empty">
                <h3>Belum ada pesanan</h3>
                <p>Pesanan pelanggan akan muncul di sini.</p>
            </div>
        `;

        return;
    }

    list.innerHTML = orders
        .slice()
        .reverse()
        .map(createOrderCard)
        .join("");
}

function getStatus(order) {

    if (!order.status) {
        return "Menunggu";
    }

    return order.status;
}

function createOrderCard(order) {

    const status = getStatus(order);

    const statusClass = status
        .toLowerCase()
        .replace(/\s+/g, "");

    return `
        <article class="order-card">

            <div class="order-top">

                <div class="order-code">
                    ${escapeHTML(order.code || "Tanpa kode")}
                </div>

                <span class="status ${statusClass}">
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
                    ${escapeHTML(order.customerName || "-")}
                </div>

                <div>
                    <b>Telepon:</b>
                    ${escapeHTML(order.phone || "-")}
                </div>

                <div>
                    <b>Alamat:</b>
                    ${escapeHTML(order.address || "-")}
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
                    ${formatRupiah(order.total || 0)}
                </div>

            </div>

            <div class="actions">

                ${
                    status !== "Diproses"
                    && status !== "Selesai"
                    ?
                    `
                    <button
                        class="btn-process"
                        onclick="changeStatus('${order.id}', 'Diproses')">
                        🔵 Diproses
                    </button>
                    `
                    : ""
                }

                ${
                    status !== "Selesai"
                    ?
                    `
                    <button
                        class="btn-done"
                        onclick="changeStatus('${order.id}', 'Selesai')">
                        🟢 Selesai
                    </button>
                    `
                    : ""
                }

                ${
                    status !== "Dibatalkan"
                    && status !== "Selesai"
                    ?
                    `
                    <button
                        class="btn-cancel"
                        onclick="changeStatus('${order.id}', 'Dibatalkan')">
                        🔴 Batalkan
                    </button>
                    `
                    : ""
                }

            </div>

        </article>
    `;
}

function changeStatus(orderId, newStatus) {

    const orders = getOrders();

    const index = orders.findIndex(
        order => String(order.id) === String(orderId)
    );

    if (index === -1) {
        alert("Pesanan tidak ditemukan.");
        return;
    }

    orders[index].status = newStatus;

    orders[index].updatedAt =
        new Date().toISOString();

    saveOrders(orders);

    renderAdminOrders();
}

function formatRupiah(value) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(Number(value) || 0);
}

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}