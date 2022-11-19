var eventBus = new Vue()

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: `
    <div class="product" class="row">

        <div class="product-image" class="col-6 p-5">
            <img v-bind:src="image">
                </div>

                <div class="product-info" class=" col-6 p-5">
                    <h1>{{brand}} {{ product }}</h1>
                    <p v-if="inStock">In Stock</p>
                    <p v-else>Out of Stock</p>
                    <p>Shipping: {{ shipping }}</p>
                        
                    <ul>
                        <li v-for="detail in details">{{ detail }}</li>
                    </ul>

                    <div v-for="(variant, index) in variants" 
                        :key="variant.variantId"
                        class=" card colour-box"
                        :style="{ backgroundColor: variant.variantColour }"
                        @mouseover="updateProduct(index)">
                    </div>
                    <br>
                    <button class="btn btn-success" v-on:click="addToCart"
                            :disabled="!inStock"
                            :class="{disabledbutton: !inStock }">Add to Cart</button>

                </div>

                <product-tabs :reviews="reviews"></product-tabs>

            </div>
    `,
  data() {
    return {
      product: "Shirt",
      brand: "Paradise Zoo",
      selectedVariant: 0,
      details: ["99% cotton", "1% animal fur", "Gender neutral"],
      variants: [
        {
          variantId: 3621,
          variantColour: "beige",
          variantImage: "img/shirt1.jpg",
          variantQuantity: 26,
        },
        {
          variantId: 3622,
          variantColour: "black",
          variantImage: "img/shirt2.jpg",
          variantQuantity: 0,
        },
        {
          variantId: 3623,
          variantColour: "green",
          variantImage: "img/shirt3.jpg",
          variantQuantity: 12,
        }
      ],
      reviews: []
    }
  },
  methods: {
    addToCart() {
        this.$emit('add-to-cart', this.variants[this.selectedVariant].variantImage)
    },
    updateProduct(index) {
      this.selectedVariant = index
    }
  },
  computed: {
    title() {
      return this.brand + ' '  + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    shipping() {
      if (this.premium) {
        return "Free";
      }
      return 5.99;
    }
  }, 
  mounted() {
    eventBus.$on('review-submitted', productReview => {
        this.reviews.push(productReview)
    })
  }
})

Vue.component('product-review', {
    template: `
    <div>
    <form class="review-form" @submit.prevent="onSubmit">
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
    </div>
    `,
    data() {
      return {
        name: null,
        review: null,
        rating: null,
        errors: []
      }
    },
    methods: {
        onSubmit() {
            this.errors = []
                if (this.name && this.review && this.rating) {
                    let productReview = {
                        name: this.name,
                        review: this.review,
                        rating: this.rating
            }
            eventBus.$emit('review-submitted', productReview)
            this.name = null
            this.review = null
            this.rating = null
        }
        else {
            if(!this.name) this.errors.push("Name required.")
            if(!this.review) this.errors.push("Review required.")
            if(!this.rating) this.errors.push("Rating required.")
          }
        }
    }
  })

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },
    template: `
    <div>
      
        <ul>

          <span class="tabs" 
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab"
                :key="tab"
          >{{ tab }}</span>
        </ul>
        
        <div>
        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul v-else>
                <li v-for="(review, index) in reviews" :key="index">
                  <p>{{ review.name }}</p>
                  <p>Rating:{{ review.rating }}</p>
                  <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>
        </div>
        <div v-show="selectedTab === 'Make a Review'">
          <product-review></product-review>
        </div>
    
      </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        }
    }
})