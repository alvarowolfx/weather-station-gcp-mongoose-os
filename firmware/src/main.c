
#include "mgos.h"
#include "mgos_gcp.h"

enum mgos_app_init_result mgos_app_init(void) {

  mgos_gcp_init();

  return MGOS_APP_INIT_SUCCESS;
}
