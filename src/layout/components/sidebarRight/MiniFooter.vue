<template>
  <footer class="mini-footer">
    <div class="footer-links">
      <a href="#">Về chúng tôi</a>
      <a href="#">Chính sách bảo mật</a>
      <a href="#">Điều khoản dịch vụ</a>
      <a href="#">Chính sách cookie</a>
    </div>
    <p class="copyright">© 2024 DevOps Connect</p>
  </footer>
</template>

<style scoped>
.mini-footer {
  padding: 0 0.5rem;
  margin-top: 1.5rem;
}

.footer-links {
  display: flex;
  flex-wrap: wrap; 
  gap: 0.75rem 1rem; 
  margin-bottom: 0.75rem;
}

.footer-links a {
  font-size: 12px;
  color: #94a3b8; 
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #64748b; 
  text-decoration: underline;
}

.copyright {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
}
</style>