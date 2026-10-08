import {
  ArrowLeft,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import type {
  Category,
} from '../../types/category'

import {
  getImageUrl,
} from '../../services/api'


interface CategoryCardProps {
  category: Category
}


function CategoryCard({
  category,
}: CategoryCardProps) {
  const imageUrl =
    getImageUrl(
      category.image
    )


  return (
    <Link
      to={`/groups/${category.slug}`}
      className="group overflow-hidden rounded-[22px] border border-sand bg-card transition duration-200 hover:-translate-y-0.5 hover:border-[#CFC2B2] hover:shadow-sm"
    >

      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-soft">

        <img
          src={
            imageUrl ??
            'https://placehold.co/400x300?text=Category'
          }
          alt={
            category.name_ar
          }
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />

      </div>


      {/* Content */}
      <div className="flex items-center justify-between gap-2 p-3.5">

        <h3 className="truncate text-sm font-bold text-ink sm:text-[15px]">
          {category.name_ar}
        </h3>


        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream text-primary transition group-hover:bg-primary group-hover:text-white">

          <ArrowLeft
            size={15}
          />

        </div>

      </div>

    </Link>
  )
}


export default CategoryCard