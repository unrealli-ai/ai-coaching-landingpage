# AI Coaching Landing Page

AI 업무활용 1:1 코칭 서비스 소개를 위한 단일 HTML 랜딩페이지입니다. GitHub Pages에 바로 배포할 수 있도록 `index.html` 중심으로 구성되어 있습니다.

## Features

- 한국어/영어 카피 전환 토글
- 크몽 서비스 CTA 연결
- 모바일 반응형 레이아웃
- FAQ 아코디언
- 스크롤 진입 시 fade-up 애니메이션
- SEO 및 Open Graph 메타 태그
- GitHub Pages 배포용 단일 파일 구조

## Project Structure

```text
.
├── index.html
├── assets/
├── uploads/
└── README.md
```

## Main CTA

랜딩페이지의 주요 신청 버튼은 아래 크몽 서비스 페이지로 연결됩니다.

```text
https://kmong.com/gig/759427
```

## Local Preview

별도 빌드 과정이 필요 없습니다. 브라우저에서 `index.html`을 직접 열어 확인할 수 있습니다.

또는 간단한 로컬 서버를 사용할 수 있습니다.

```powershell
cd "C:\Users\전수현\workspace\ai-coaching-landingpage"
python -m http.server 8000
```

브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:8000
```

## Deploy to GitHub Pages

1. GitHub에서 새 repository를 생성합니다.
2. 로컬 폴더에서 Git을 초기화하고 커밋합니다.

```powershell
cd "C:\Users\전수현\workspace\ai-coaching-landingpage"
git init
git branch -M main
git add .
git commit -m "Add AI coaching landing page"
```

3. GitHub repository를 remote로 연결합니다.

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

4. GitHub repository에서 `Settings > Pages`로 이동합니다.
5. `Build and deployment`에서 `Deploy from a branch`를 선택합니다.
6. Branch는 `main`, folder는 `/root`로 설정합니다.
7. 저장 후 표시되는 GitHub Pages URL에서 배포 결과를 확인합니다.

## Editing Notes

- 주요 콘텐츠, 스타일, 스크립트는 모두 `index.html` 안에 있습니다.
- KO/EN 텍스트 전환은 하단 `<script>`의 `enCopy` 데이터에서 관리합니다.
- CTA URL을 변경하려면 `https://kmong.com/gig/759427` 값을 새 링크로 교체합니다.
- 공유 미리보기 이미지를 추가하려면 `<head>`에 `og:image` 메타 태그를 추가하면 됩니다.

## License

This project is for the unrealli AI coaching landing page. All copy and branding assets are owned by the project owner.
