<template>
    <aside class="sidebar">
        <div class="profile">
            <div class="avatar">&lt;DT /&gt;</div>
        </div>

        <nav class="nav">
            <ul>
                <li>
                    <a href="#/dashboard" class="nav-link active">
                        <Home class="icon" />
                        <span class="label">Dashboard</span>
                    </a>
                </li>
                <li>
                    <a href="#/dashboard/add-product" class="nav-link">
                        <PlusSquare class="icon" />
                        <span class="label">Add Product</span>
                    </a>
                </li>
                <li>
                    <a href="#/dashboard/manage-product" class="nav-link">
                        <Edit3 class="icon" />
                        <span class="label">Manage Product</span>
                    </a>
                </li>
                <li>
                    <a href="#/dashboard/orders" class="nav-link">
                        <ShoppingCart class="icon" />
                        <span class="label">Orders</span>
                    </a>
                </li>
                <li>
                    <a href="#/dashboard/coupons" class="nav-link">
                        <Tag class="icon" />
                        <span class="label">Coupons</span>
                    </a>
                </li>
                <li>
                    <a href="#/logout" class="nav-link">
                        <LogOut class="icon" />
                        <span class="label">Logout</span>
                    </a>
                </li>
            </ul>
        </nav>

        <div class="spacer"></div>
    </aside>
</template>

<script setup>
import { Home, PlusSquare, Edit3, ShoppingCart, Tag, LogOut } from 'lucide-vue-next'
</script>

<style scoped>
.sidebar {
    width: 220px;
    min-height: 100vh;
    background: #0B3F6B;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 28px 12px;
    box-sizing: border-box;
}
.profile {
    display: flex;
    justify-content: center;
    margin-bottom: 18px;
}
.avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00a2ff;
    font-weight: 700;
}
.nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    color: #ffffff;
    text-decoration: none;
    border-radius: 6px;
}

.nav-link:hover {
    background: rgba(255,255,255,0.03);
}

.icon {
    width: 20px;
    height: 20px;
    color: #FFF3CD;
}

.label {
    font-size: 14px;
    opacity: 0.95;
    color: #ffffff;
}

.nav-link.active {
    background: rgba(173, 214, 241, 0.12);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02);
}
.spacer {
    flex: 1 1 auto;
}
</style>