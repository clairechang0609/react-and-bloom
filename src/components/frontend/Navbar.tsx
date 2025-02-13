import { NavLink } from 'react-router';
import styled from 'styled-components';

const Nav = styled("nav")`
  height: 70px;
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 5px rgba(0,0,0,0.1);
`;

const Link = styled("span")`
  position: relative;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: 0.875rem;

  &::before {
    content: '';
    height: 1px;
    width: 0;
    background-color: black;
    position: absolute;
    bottom: 10px;
    transition: width 0.3s ease-in-out;
  }

  &:hover::before {
    width: 100%;
  }
`;

const Heading = styled("h1")`
  font-family: 'Cormorant Garamond', Didot, 'Bodoni MT', 'Noto Serif Display', 'URW Palladio L', P052, Sylfaen, serif;
  color: black;
  font-size: 32px;
  margin: 0;
`;

const Navbar = () => {
  return (
    <Nav className="fixed-top py-3 px-5 d-flex align-items-center bg-white bg-opacity-10">
      <NavLink to="/" className="d-flex align-items-center px-4">
        {/* <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 142 197" overflow="hidden" className="me-3"><g transform="translate(-1792 -142)"><g><path d="M1901.82 144.028C1903.11 144.028 1907.17 144.848 1910.74 145.817 1914.31 146.798 1919.82 150.388 1923.08 153.643 1926.81 157.233 1929.73 162.289 1930.86 166.861 1932.32 172.24 1932.32 176.328 1931.18 182.366 1930.21 186.938 1927.29 193.944 1924.53 198.355 1921.94 202.591 1918.21 206.84 1916.41 207.66 1914.63 208.48 1913.16 209.785 1913.16 210.43 1913.16 211.251 1915.76 212.716 1918.85 213.698 1921.94 214.841 1926.15 218.27 1928.27 221.04 1930.7 224.792 1931.84 228.705 1931.68 233.761 1931.68 238.172 1929.73 245.178 1926.81 251.539 1924.21 257.415 1919.34 264.421 1916.09 267.366 1910.57 272.423 1908.95 272.92 1899.7 272.92 1891.74 272.92 1887.69 271.938 1879.9 268.025 1874.55 265.416 1870 263.13 1869.68 263.13 1869.52 263.13 1869.36 268.684 1869.36 275.367 1869.36 282.051 1868.22 296.574 1866.77 307.668 1865.31 318.6 1863.35 330.179 1862.22 333.285 1861.24 336.391 1859.3 339 1858 339 1856.54 339 1855.57 337.696 1855.73 335.732 1855.73 333.944 1857.19 325.123 1858.82 316.153 1860.6 305.718 1861.73 291.033 1861.91 275.366 1862.07 261.825 1861.43 249.426 1860.77 247.624 1859.63 244.518 1859.31 244.693 1856.56 249.251 1854.94 252.022 1851.37 256.594 1848.6 259.526 1845.35 262.632 1840.15 265.725 1834.8 267.191 1827.66 269.315 1825.22 269.477 1818.41 267.675 1812.57 266.048 1808.84 263.761 1804.29 258.705 1800.71 254.792 1797.14 248.915 1796.17 245.648 1795.19 242.219 1794.71 236.84 1795.19 233.734 1795.84 230.627 1797.94 225.907 1799.9 223.299 1802.01 220.69 1807.2 216.777 1811.75 214.652 1816.14 212.689 1822.79 210.9 1832.85 210.9L1825.71 207.149C1821.65 205.186 1816.62 201.273 1814.35 198.502 1812.07 195.571 1809.16 190.178 1808.02 186.265 1806.4 180.711 1806.24 177.296 1807.54 171.742 1808.51 167.667 1811.43 161.307 1814.19 157.38 1816.78 153.628 1821.65 149.379 1824.74 148.075 1827.83 146.77 1832.05 145.627 1834 145.627 1836.11 145.627 1841.63 147.591 1846.5 150.038 1852.66 153.306 1856.4 156.56 1858.99 161.132 1860.94 164.723 1863.54 170.922 1866.46 182.339L1868.41 174.996C1869.39 170.922 1872.14 164.723 1874.26 161.294 1876.53 157.703 1880.42 153.467 1883.18 151.504 1885.94 149.715 1890.65 147.268 1893.74 146.125 1896.83 144.982 1900.56 144.161 1901.86 144ZM1817.41 165.234C1815.46 169.148 1814.16 174.863 1814.16 179.596 1814.16 185.473 1815.3 188.566 1818.71 192.815 1821.3 196.082 1827.15 200.319 1832.83 202.927 1838.19 205.536 1844.53 207.822 1847.12 208.306 1850.04 208.965 1851.51 208.629 1851.51 207.325 1851.51 206.182 1850.37 201.125 1848.92 196.23 1847.46 191.335 1844.21 183.173 1841.61 178.278 1839.18 173.384 1837.56 168.812 1838.04 168.166 1838.52 167.346 1839.99 166.862 1841.29 166.862 1842.43 166.862 1845.34 170.775 1847.78 175.508 1850.05 180.08 1853.79 189.211 1855.9 195.41L1859.63 206.827C1858.66 180.564 1857.52 173.544 1855.24 168.487 1853.46 164.077 1849.89 159.679 1846.48 157.555 1843.39 155.591 1838.85 153.48 1836.1 152.983 1832.69 152.324 1829.61 152.983 1825.88 155.43 1823.12 157.219 1819.23 161.629 1817.44 165.22ZM1877.95 168.502C1876 172.577 1873.89 178.776 1873.24 182.366L1872.26 188.888C1880.05 178.117 1884.76 173.222 1887.69 170.936 1890.44 168.812 1894.18 166.862 1895.81 166.862 1897.27 166.862 1898.57 167.843 1898.57 168.986 1898.57 169.968 1895.65 173.397 1892.08 176.328 1888.5 179.099 1882.82 185.795 1879.26 191.013 1875.85 196.069 1871.79 202.766 1870.34 205.697L1867.74 210.914C1900.53 208.951 1903.45 208.306 1909.13 204.393 1912.71 201.945 1917.26 197.535 1919.2 194.442 1921.15 191.335 1923.41 185.634 1924.23 181.559 1925.2 177.149 1925.2 172.092 1924.39 169 1923.57 166.068 1920.98 161.335 1918.54 158.565 1914.65 154.154 1912.69 153.347 1904.25 152.688 1895.49 152.03 1893.87 152.365 1888.02 156.602 1884.45 159.21 1879.9 164.603 1877.96 168.516ZM1880.7 219.737C1885.57 220.557 1892.22 222.185 1895.31 223.489 1898.4 224.793 1903.44 227.563 1906.35 229.849 1909.11 231.974 1911.54 235.228 1911.54 237.03 1911.54 238.819 1911.22 240.298 1910.73 240.298 1910.24 240.298 1907.48 238.509 1904.72 236.385 1901.8 234.099 1896.76 231.328 1893.68 229.863 1890.59 228.558 1882.81 226.932 1876.32 226.111 1866.58 224.968 1864.46 225.13 1863.66 227.254 1863 228.559 1863.34 233.454 1864.32 237.864 1865.45 243.243 1868.21 248.474 1872.28 253.194 1875.53 257.268 1881.2 261.84 1884.77 263.468 1888.34 264.933 1894.35 266.399 1898.24 266.399 1901.98 266.399 1907.01 265.418 1909.6 264.113 1912.04 262.809 1915.61 259.057 1917.39 255.628 1919.34 252.038 1922.1 245.677 1923.56 241.105 1925.83 234.247 1925.99 232.297 1924.21 228.222 1923.07 225.452 1919.34 222.185 1915.61 220.221 1911.06 217.935 1905.05 216.792 1895.31 216.469 1887.69 216.147 1879.41 216.631 1876.65 217.29 1872.1 218.433 1872.44 218.594 1880.7 219.737ZM1808.63 223.973C1807.01 225.278 1804.58 228.545 1803.28 231.315 1801.82 234.422 1801.17 238.173 1801.82 241.589 1802.31 244.52 1805.72 249.913 1809.78 254.149 1816.11 260.832 1817.25 261.33 1824.71 261.491 1830.4 261.491 1834.94 260.186 1839.81 257.416 1845 254.31 1847.77 251.055 1851.5 243.216 1854.25 237.501 1856.37 231.638 1856.37 230.159 1856.37 227.872 1855.39 227.388 1851.82 228.195 1849.39 228.854 1844.19 230.643 1840.13 232.431 1836.07 234.22 1830.39 237.326 1827.47 239.612 1824.71 241.737 1821.46 243.525 1820.65 243.525 1819.83 243.525 1819.03 242.059 1819.03 240.257 1819.03 238.294 1821.46 235.363 1825.2 232.915 1828.45 230.629 1835.58 227.039 1840.94 224.914 1848.09 222.144 1850.03 220.678 1848.25 219.697 1846.95 219.038 1840.62 218.231 1834.45 217.908 1827.97 217.585 1820.66 218.231 1817.41 219.374 1814.16 220.517 1810.27 222.642 1808.65 223.946Z" fill="#000000" fillRule="evenodd" fillOpacity="1"/></g></g></svg> */}
        <Heading>&<em>Bloom</em></Heading>
      </NavLink>
      <div className="d-flex align-items-center ms-auto">
        <NavLink to="/products" className="px-4">
          <Link>PLANTS・所有植栽</Link>
        </NavLink>
        <NavLink to="/cart" className="px-4">
          <Link>CART・購物車</Link>
        </NavLink>
        {/* <i className="bi bi-cart2 fs-4 cursor-pointer" /> */}
      </div>
    </Nav>
  )
};

export default Navbar;
