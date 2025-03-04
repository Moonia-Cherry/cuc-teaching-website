<script setup lang="ts">

</script>
<template>
  <main>
    <div class="home">
      <img src="@/assets/home/background.png" alt="">
    </div>
    <div class="content">
      <div>
        <h1>欢迎来到<br><span>计算机思维系列课程平台</span></h1>
        <p>Welcome to the Computational Thinking Series </p>
        <p class="mod">计算思维系列课程通过系统化训练、多元化问题求解方解析及Python实践培养学生抽象建模、逻辑分解和算法设计核心能力，助力高效解决科学、工程与生活中的复杂问题</p>
      </div>
      <div class="begin">
        <a href="#">点击进入</a>
      </div>
    </div>
  </main>
</template>
<style scoped>
  .home img {
    z-index: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(2px);
  }

  .home:before {
    z-index: 777;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(3, 96, 251, 0.3);
    width: 100%;
    height: 100%;
  }

  .content {
    z-index: 888;
    color: #fff;
    width: 100%;
    margin-top: 12%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    text-align: center;
  }

  .content h1 {
    font-size: 5rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 5px;
    line-height: 75px;
    margin-bottom: 40px;
    text-align: center;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .content h1 span {
    display: inline-block;
    font-size: 0.9em;
    font-weight: 600;
    margin-left: 0;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .content p {
    margin-bottom: 15px;
    line-height: 25px;
    text-align: center;
    overflow-wrap: break-word;
    word-break: normal;
  }
  .mod{
    padding: 0 20%;
  }
  .begin{
    margin-bottom:0px;
  }

  .content a {
  position: relative;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  padding: 18px 45px;
  color: #fff;
  font-size: 1.4em;
  font-weight: 600;
  text-decoration: none;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  box-shadow: 
    0 8px 32px rgba(31, 38, 135, 0.15),
    inset 0 4px 12px rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  margin-top: 12%;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

/* 光效装饰 */
.content a::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transform: skewX(-20deg);
  transition: 0.6s;
}

/* 悬浮动效 */
.content a:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-3px);
  box-shadow: 
    0 12px 40px rgba(31, 38, 135, 0.25),
    inset 0 4px 12px rgba(255, 255, 255, 0.3);
}

.content a:hover::before {
  left: 140%;
}

/* 点击动效 */
.content a:active {
  transform: translateY(1px);
  box-shadow: 
    0 4px 16px rgba(31, 38, 135, 0.2),
    inset 0 2px 6px rgba(255, 255, 255, 0.3);
}

/* 添加箭头图标 */
.content a::after {
  content: '→';
  display: inline-block;
  font-weight: 500;
  transition: transform 0.3s;
}

.content a:hover::after {
  transform: translateX(4px);
}

@media (max-width: 767px) {
  .content{
    margin-top: 9%;
    margin-bottom: 5%;
    padding: 10px;
  }
  .content h1{
    font-size: 3rem;
    line-height: 50px;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }
  .content h1 span {
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }
  .content p {
    margin-bottom: 10px;
    font-size: 1rem;
    padding: 0 10%;
  }
  .begin{
    margin-top: 60px;
  }
}

</style>