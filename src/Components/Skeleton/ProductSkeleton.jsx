import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function ProductSkeleton() {
  return (
    <div className="product-card">
      <Skeleton className="product-image" />

      <h2 className="product-name">
        <Skeleton height={24} />
      </h2>

      <p className="product-price">
        <Skeleton width={70} height={20} />
      </p>
    </div>
  );
}

export default ProductSkeleton;
