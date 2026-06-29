import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function SingleProductSkeleton() {
  return (
    <div className="product-details-container">
      <p className="para">
        <Skeleton width={120} />
      </p>

      <div className="product-detail-wrapper">
        <div className="all-products-photos">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} width={60} height={60} />
          ))}
        </div>

        <div className="main-photo">
          <Skeleton height={450} />
        </div>

        <div className="product-detail-content">
          <h1>
            <Skeleton width={200} />
          </h1>

          <p>
            <Skeleton width={80} />
          </p>

          <Skeleton height={40} width={120} />

          <Skeleton count={3} />
        </div>
      </div>
    </div>
  );
}

export default SingleProductSkeleton;
