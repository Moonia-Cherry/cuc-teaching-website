<script setup lang="ts"></script>
<template>
  <main>
    <div class="home">
      <img src="@/assets/home/background_2.png" alt="" />
    </div>
    <div class="content">
      <div>
        <h1>欢迎来到<br /><span>计算机思维系列课程平台</span></h1>
        <p>Welcome to the Computational Thinking Series</p>
        <p class="mod">
          计算思维系列课程通过系统化训练、多元化问题求解方解析及Python实践培养学生抽象建模、逻辑分解和算法设计核心能力，助力高效解决科学、工程与生活中的复杂问题
        </p>
      </div>
      <div class="begin">
        <a href="#">点击进入</a>
      </div>
    </div>
  </main>
</template>
<style scoped>


@media (width <= 767px) {
  .content {
    padding: 10px;
    margin-top: 9%;
    margin-bottom: 5%;
  }

  .content h1 {
    font-size: 3rem;
    line-height: 50px;
    text-shadow: 0 1px 4px rgb(0 0 0 / 30%);
  }

  .content h1 span {
    text-shadow: 0 1px 4px rgb(0 0 0 / 30%);
  }

  .content p {
    padding: 0 10%;
    margin-bottom: 10px;
    font-size: 1rem;
  }

  .begin {
    margin-top: 60px;
  }
}

.home img {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(2px);
}

.home::before {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 777;
  width: 100%;
  height: 100%;
  content: "";
  background: rgb(3 96 251 / 30%);
}

.content {
  position: relative;
  z-index: 888;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 12%;
  color: #fff;
  text-align: center;
}

.content h1 {
  margin-bottom: 40px;
  font-size: 5rem;
  font-weight: 700;
  line-height: 75px;
  text-align: center;
  text-shadow: 0 2px 8px rgb(0 0 0 / 30%);
  text-transform: uppercase;
  letter-spacing: 5px;
}

.content h1 span {
  display: inline-block;
  margin-left: 0;
  font-size: 0.9em;
  font-weight: 600;
  text-shadow: 0 2px 8px rgb(0 0 0 / 30%);
}

.content p {
  margin-bottom: 15px;
  line-height: 25px;
  text-align: center;
  word-break: normal;
  overflow-wrap: break-word;
}

.mod {
  padding: 0 20%;
}

.begin {
  margin-bottom: 0;
}

.content a {
  position: relative;
  display: inline-flex;
  gap: 12px;
  align-items: center;
  padding: 18px 45px;
  margin-top: 12%;
  overflow: hidden;
  font-size: 1.4em;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  text-shadow: 0 2px 4px rgb(0 0 0 / 20%);
  background: rgb(255 255 255 / 15%);
  backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 15px;
  box-shadow:
    0 8px 32px rgb(31 38 135 / 15%),
    inset 0 4px 12px rgb(255 255 255 / 20%);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

/* 光效装饰 */
.content a::before {
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  content: "";
  background: linear-gradient(
    90deg,
    transparent,
    rgb(255 255 255 / 30%),
    transparent
  );
  transition: 0.6s;
  transform: skewX(-20deg);
}

/* 悬浮动效 */
.content a:hover {
  background: rgb(255 255 255 / 25%);
  box-shadow:
    0 12px 40px rgb(31 38 135 / 25%),
    inset 0 4px 12px rgb(255 255 255 / 30%);
  transform: translateY(-3px);
}

.content a:hover::before {
  left: 140%;
}

/* 点击动效 */
.content a:active {
  box-shadow:
    0 4px 16px rgb(31 38 135 / 20%),
    inset 0 2px 6px rgb(255 255 255 / 30%);
  transform: translateY(1px);
}

/* 添加箭头图标 */
.content a::after {
  display: inline-block;
  font-weight: 500;
  content: "→";
  transition: transform 0.3s;
}

.content a:hover::after {
  transform: translateX(4px);
}
</style>
