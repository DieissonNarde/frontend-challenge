import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import api from '../services/api';

import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Pagination } from '../components/Pagination';

import { CardWrapper, CategoryWrapper, HeaderContainer, HeaderContent, HomeContent, HomeSection } from '../styles/pages/home';

interface IMovie {
  id: number;
  poster_path: string;
  title: string;
  release_date: string;
}

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const Home: NextPage = () => {
  const [movies, setMovies] = useState<Array<IMovie>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPopularMovies() {
      await api.get(`/popular?api_key=${apiKey}&page=${currentPage}`)
        .then((response) => {
          const data = response.data.results;

          setMovies(data);
          setLoading(false);
        }, (error) => {
          console.error(error);
        });
    }

    getPopularMovies();
  }, [currentPage])

  return (
    <>
      <Head>
        <title>TMDB</title>
      </Head>

      <main>
        <Header />
        <HomeSection>
          <HeaderContainer>
            <HeaderContent>
              <h3>Milhões de filmes, séries e pessoas para descobrir. Explore já.</h3>
              <p>FILTRE POR:</p>
              <CategoryWrapper>
                <Button>Teste</Button>
              </CategoryWrapper>
            </HeaderContent>
          </HeaderContainer>

          <HomeContent>
            <CardWrapper>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {movies &&
                    movies.map(movie => (
                      <Link href={`/movie/${movie.id}`}>
                        <a>
                          <Card
                            key={movie.id}
                            image={movie.poster_path}
                            title={movie.title}
                            subtitle={movie.release_date}
                          />
                        </a>
                      </Link>
                    ))
                  }
                </>
              )}

            </CardWrapper>
          </HomeContent>

          <Pagination
            currentPage={currentPage}
            totalCount={400}
            pageSize={movies.length}
            siblingCount={1}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        </HomeSection>
      </main>
    </>
  )
}

export default Home;
