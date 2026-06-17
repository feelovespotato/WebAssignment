function observeAnimations() {
  //watch elements store in observer
    const observer = new IntersectionObserver((entries) => {
      //watch multiple element at once  
      entries.forEach(entry => {
            //if visible on screen
            if (entry.isIntersecting) {
              //add css class in-view
                entry.target.classList.add('in-view');
                //play once only
                observer.unobserve(entry.target);
                
            }
        });
        // onlyy trigger when 15% of element visible
    }, { threshold: 0.15 });

    //every element with animate-fade-up tell observer to watch themmm
    document.querySelectorAll('.animate-fade-up').forEach(el => {
        observer.observe(el);
    });
}