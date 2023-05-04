# 基于ubuntu，用于构建ai_platform的服务
FROM ubuntu:latest


# ======== 镜像中一些必要的可设置的参数，请酌情根据个人需求修改 ========

# 账户设置
ARG root_password="ssdlut314@Lab"
ARG custom_username1="eharecz"       # 可选，为容器添加其他开发账户名，用于开发或维护时通过ssh进入容器查看细节
ARG custom_password1="ssdlut314"     # 可选，对于其他开发账户名的密码

# 容器对外服务端口设置，不等同于外部监听端口，请在运行具体容器时指定对应映射外部监听端口
ARG frontend_port=443   # 默认https端口
ARG backend_port=8000
ARG model_port=31400-31499


# ======== 具体构建过程 ========

# 设置工作目录
WORKDIR /ai_platform

# 更新镜像源索引
RUN apt update
RUN apt -y upgrade

# 安装sudo工具
RUN apt install -y sudo

# 设置root账户密码
RUN echo "root:$root_password" | chpasswd

# 添加其他开发账户
RUN adduser $custom_username1
RUN usermod -aG sudo $custom_username1
RUN echo "$custom_username1:$custom_password1" | chpasswd

# 安装ssh服务
RUN apt install -y openssh-server
RUN mkdir /run/sshd

# 配置nodejs环境
RUN apt install -y nodejs
RUN apt install -y npm
RUN npm install -g n
RUN n 18

# 安装docker环境
RUN apt install -y curl
RUN curl -sSL https://get.docker.com/ | sh
RUN service docker start

# 可选，为其他用户添加非特权执行docker能力
RUN usermod -aG docker $custom_username1

# 可选，配置vim
RUN apt install -y vim

# 可选，配置网络查看相关工具
RUN apt install -y lsof
RUN apt install -y net-tools

# 可选，配置fish为默认shell，纯安利（生产力max），fish配置要放在后面，因为涉及到改shell
RUN apt install -y fish
SHELL [ "/usr/bin/fish" ]
ENV fish_greeting ""

# 声明端口
EXPOSE 22
EXPOSE $frontend_port
EXPOSE $backend_port
EXPOSE $model_port

# ======== 启动dokcer和ssh服务并保持容器后台运行 ========
CMD ["sh", "-c", "service docker start && /usr/sbin/sshd -D"]