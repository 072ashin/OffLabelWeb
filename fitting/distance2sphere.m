function [F, J] = distance2sphere(x, P)
% Calculate modified signed distance of each point in each row of P to the sphere
% parameterized by x = (rho phi zeta k)
% Input:
%     x : tuple of 4 real numbers (rho phi zeta k) describing the sphere
%     P : n queries of 3-D points of size n * 3
% Output:
%     F is of size n * 1 are the modified signed distances corresponding to each point in P
%     J is of size n * 4 are the Jacobian of F with respect to x
    rho = x(1); phi = x(2); zeta = x(3); k = x(4);
    n = [cos(phi) * sin(zeta), sin(phi) * sin(zeta), cos(zeta)];
    F = k/2 * sum((P - rho * repmat(n, size(P, 1), 1)) .^ 2, 2) - (P - rho * repmat(n, size(P, 1), 1)) * n';
    J = zeros(size(P, 1), 4);
    n_phi = [-sin(phi) * sin(zeta), cos(phi) * sin(zeta), 0];
    n_zeta = [cos(phi) * cos(zeta), sin(phi) * cos(zeta), -sin(zeta)];
    J(:, 1) = k * (repmat(rho, size(P, 1), 1) - P * n') + ones(size(P, 1), 1);
    J(:, 2) = (-k * rho - 1) * P * n_phi';
    J(:, 3) = (-k * rho - 1) * P * n_zeta';
    J(:, 4) = 1/2 * (sum(P .^ 2, 2) - 2 * rho * P * n' + repmat(rho * rho, size(P, 1), 1));
end
