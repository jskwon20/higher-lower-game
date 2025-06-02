FROM python:3.11-slim

# 필요한 패키지 설치
RUN pip install flask

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 디렉토리 생성
RUN mkdir -p /app/templates /app/static

# 필요한 파일 복사
COPY main.py game_data.py ./
COPY templates/ /app/templates/
COPY static/ /app/static/

# 권한 설정
RUN chmod -R 755 /app

# 포트 설정
EXPOSE 5000

# 실행 명령어
CMD ["python", "main.py"]
